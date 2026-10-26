// Dummy backend: answers every API request in the browser instead of calling a server.
// Loaded on first request by mockBaseQuery.js. Cart, addresses and orders live in localStorage.
import { categories, products, toListItem, findVariant } from "./mockData";

const STORE_KEY = "awaitstore-mock-db";

const load = () => {
  try {
    const db = JSON.parse(localStorage.getItem(STORE_KEY));
    if (db && Array.isArray(db.cart) && Array.isArray(db.addresses)) return { orders: [], ...db };
  } catch {
    // fall through to a fresh store
  }
  return { cart: [], addresses: [], orders: [] };
};

const save = (db) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(db));
  } catch {
    // storage unavailable: keep working in memory for this page load
  }
};

const ok = (data) => ({ data });
const fail = (status, message) => ({ error: { status, data: { message } } });

const cartResponse = (db) => ({
  data: {
    items: db.cart
      .map(({ variantId, quantity }) => {
        const found = findVariant(variantId);
        if (!found) return null;
        const { product, variant } = found;
        return {
          _id: variantId,
          quantity,
          variantId: { ...variant, productId: { _id: product._id, name: product.name } },
        };
      })
      .filter(Boolean),
  },
});

const addToCart = (db, variantId, quantity) => {
  const existing = db.cart.find((i) => i.variantId === variantId);
  if (existing) existing.quantity += quantity;
  else db.cart.push({ variantId, quantity });
};

const summarizeCart = (db) => {
  const orderItems = [];
  const removedItems = [];
  for (const { variantId, quantity } of db.cart) {
    const found = findVariant(variantId);
    if (!found) continue;
    const { product, variant } = found;
    const line = {
      variantId,
      productName: product.name,
      image: variant.images[0],
      weight: variant.weight,
      weightType: variant.weightType,
      flavor: variant.flavor,
    };
    if (quantity > variant.stock) removedItems.push({ ...line, availableStock: variant.stock });
    else orderItems.push({ ...line, quantity, price: variant.price, subtotal: variant.price * quantity });
  }
  const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
  return { orderItems, removedItems, totalAmount };
};

const routes = [
  // ---- public ----
  ["GET", /^nutrify\/home$/, () => ok({ data: { products: products.map(toListItem) } })],
  ["GET", /^nutrify\/categories\/top$/, () => ok({ categories })],
  ["GET", /^nutrify\/home\/([^/]+)$/, (id) => {
    const p = products.find((x) => x._id === id);
    return p ? ok(p) : fail(404, "Product not found");
  }],
  ["GET", /^nutrify\/productBycatgeory\/([^/]+)$/, (id) =>
    ok({ data: products.filter((p) => p.categoryId === id).map(toListItem) })],
  ["POST", /^user\/auth$/, () => ok({ message: "OTP sent (dummy mode: any OTP works)" })],
  ["POST", /^user\/auth\/verify$/, (_, body) => {
    if (!body?.otp) return fail(400, "Enter the OTP");
    return ok({
      token: "dummy-token",
      user: { _id: "user-demo", name: "Demo User", mobileNumber: body.mobileNumber },
    });
  }],

  // ---- private (user) ----
  ["GET", /^cart$/, (_, __, db) => ok(cartResponse(db))],
  ["POST", /^cart$/, (_, body, db) => {
    if (!findVariant(body?.variantId)) return fail(404, "Variant not found");
    addToCart(db, body.variantId, body.quantity || 1);
    return ok({ message: "Item added", ...cartResponse(db) });
  }],
  ["PATCH", /^cart\/([^/]+)$/, (variantId, body, db) => {
    const item = db.cart.find((i) => i.variantId === variantId);
    if (!item) return fail(404, "Item not in cart");
    const found = findVariant(variantId);
    const quantity = Math.max(1, Math.min(Number(body?.quantity) || 1, found?.variant.stock ?? 99));
    item.quantity = quantity;
    return ok({ message: "Quantity updated", ...cartResponse(db) });
  }],
  ["DELETE", /^cart\/clear$/, (_, __, db) => {
    db.cart = [];
    return ok({ message: "Cart cleared" });
  }],
  ["DELETE", /^cart\/([^/]+)$/, (variantId, __, db) => {
    db.cart = db.cart.filter((i) => i.variantId !== variantId);
    return ok({ message: "Item removed", ...cartResponse(db) });
  }],
  ["POST", /^cart\/sync$/, (_, body, db) => {
    for (const item of body?.items || []) {
      if (findVariant(item.variantId)) addToCart(db, item.variantId, item.quantity || 1);
    }
    return ok({ message: "Cart synced", ...cartResponse(db) });
  }],
  ["GET", /^address$/, (_, __, db) => ok({ address: db.addresses })],
  ["POST", /^address$/, (_, body, db) => {
    const address = { ...body, _id: `addr-${Date.now()}` };
    if (address.defaultAddress || db.addresses.length === 0) {
      db.addresses.forEach((a) => { a.defaultAddress = false; });
      address.defaultAddress = true;
    }
    db.addresses.push(address);
    return ok({ message: "Address added", address });
  }],
  ["DELETE", /^address\/([^/]+)$/, (id, __, db) => {
    db.addresses = db.addresses.filter((a) => a._id !== id);
    return ok({ message: "Address deleted" });
  }],
  ["GET", /^order\/initiate$/, (_, __, db) => ok({ data: summarizeCart(db) })],
  ["GET", /^order$/, (_, __, db) => ok({ orders: [...db.orders].reverse() })],
  ["POST", /^order$/, (_, body, db) => {
    const address = db.addresses.find((a) => a._id === body?.addressId);
    if (!address) return fail(400, "Choose a delivery address");
    const { orderItems, totalAmount } = summarizeCart(db);
    if (orderItems.length === 0) return fail(400, "Your cart is empty");
    const order = {
      _id: `ORD${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      status: body.paymentMethod === "cod" ? "Confirmed" : "Paid",
      paymentMethod: body.paymentMethod === "cod" ? "cod" : "online",
      address,
      items: orderItems,
      totalAmount,
    };
    db.orders.push(order);
    db.cart = [];
    return ok({ message: "Order placed", order });
  }],
];

const handleRequest = (args) => {
  const { url, method = "GET", body } = typeof args === "string" ? { url: args } : args;
  const path = url.split("?")[0].replace(/^\/+|\/+$/g, "");

  for (const [routeMethod, pattern, handler] of routes) {
    const match = method.toUpperCase() === routeMethod && path.match(pattern);
    if (match) {
      const db = load();
      const result = handler(match[1], body, db);
      if (method.toUpperCase() !== "GET") save(db);
      return result;
    }
  }
  return fail(404, `Dummy backend has no route for ${method} ${path}`);
};

export default handleRequest;
