// Dummy backend: answers every API request in the browser instead of calling a server.
// Loaded on first request by mockBaseQuery.js. Cart, addresses and orders live in localStorage.
import { categories, products, toListItem, findVariant } from "./mockData";

const STORE_KEY = "awaitstore-mock-db";

const DEFAULT_PREFERENCES = { orderUpdates: true, offers: true, newsletter: false };

const emptyDb = () => ({
  cart: [],
  addresses: [],
  orders: [],
  profile: null,
  preferences: { ...DEFAULT_PREFERENCES },
});

const load = () => {
  try {
    const db = JSON.parse(localStorage.getItem(STORE_KEY));
    if (db && Array.isArray(db.cart) && Array.isArray(db.addresses)) return { ...emptyDb(), ...db };
  } catch {
    // fall through to a fresh store
  }
  return emptyDb();
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
    else orderItems.push({ ...line, productId: product._id, quantity, price: variant.price, mrp: variant.mrp, subtotal: variant.price * quantity });
  }
  const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
  return { orderItems, removedItems, totalAmount };
};

// ---- Orders ----
// Stages are derived from the time since the order was placed, so demo orders "progress"
// on their own: packed after 30 min, shipped after 3 h, out for delivery after 24 h,
// delivered after 48 h. Only cancellation is stored.
const MINUTE = 60 * 1000;
const ORDER_STAGES = [
  { key: "placed", label: "Order placed", after: 0 },
  { key: "packed", label: "Packed", after: 30 * MINUTE },
  { key: "shipped", label: "Shipped", after: 3 * 60 * MINUTE },
  { key: "out_for_delivery", label: "Out for delivery", after: 24 * 60 * MINUTE },
  { key: "delivered", label: "Delivered", after: 48 * 60 * MINUTE },
];
const CANCELLABLE = new Set(["placed", "packed"]);

const presentOrder = (order, now = Date.now()) => {
  const placedAt = new Date(order.createdAt).getTime();
  const cutoff = order.cancelledAt ? new Date(order.cancelledAt).getTime() : now;
  const reached = ORDER_STAGES.filter((s) => placedAt + s.after <= cutoff);
  const current = reached[reached.length - 1];

  const timeline = ORDER_STAGES.map((s) => ({
    key: s.key,
    label: s.label,
    at: placedAt + s.after <= cutoff ? new Date(placedAt + s.after).toISOString() : null,
    done: placedAt + s.after <= cutoff,
  }));
  if (order.cancelledAt) {
    timeline.splice(reached.length, timeline.length, {
      key: "cancelled",
      label: "Cancelled",
      at: order.cancelledAt,
      done: true,
    });
  }

  const status = order.cancelledAt ? "cancelled" : current.key;
  const mrpTotal = order.items.reduce((sum, i) => sum + (i.mrp ?? i.price ?? 0) * i.quantity, 0);
  const isCod = order.paymentMethod === "cod";

  return {
    ...order,
    status,
    statusLabel: order.cancelledAt ? "Cancelled" : current.label,
    timeline,
    canCancel: !order.cancelledAt && CANCELLABLE.has(current.key),
    expectedDelivery: new Date(placedAt + ORDER_STAGES[4].after).toISOString(),
    payment: {
      method: isCod ? "Cash on delivery" : "Paid online",
      status: order.cancelledAt
        ? isCod ? "Not charged" : "Refund initiated"
        : isCod ? (status === "delivered" ? "Paid" : "Pay on delivery") : "Paid",
    },
    pricing: {
      mrpTotal,
      discount: Math.max(0, mrpTotal - order.totalAmount),
      delivery: 0,
      total: order.totalAmount,
    },
  };
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
  ["POST", /^user\/auth\/verify$/, (_, body, db) => {
    if (!body?.otp) return fail(400, "Enter the OTP");
    db.profile ??= { _id: "user-demo", name: "Demo User", email: "", gender: "", dob: "" };
    db.profile.mobileNumber = body.mobileNumber;
    return ok({ token: "dummy-token", user: db.profile });
  }],

  // ---- private (user) ----
  ["GET", /^profile$/, (_, __, db) => (db.profile ? ok({ user: db.profile }) : fail(401, "Please log in"))],
  ["PATCH", /^profile$/, (_, body, db) => {
    if (!db.profile) return fail(401, "Please log in");
    const name = String(body?.name ?? db.profile.name).trim();
    if (!name) return fail(400, "Name can't be empty");
    const email = String(body?.email ?? db.profile.email).trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, "Enter a valid email address");
    db.profile = { ...db.profile, name, email, gender: body?.gender ?? db.profile.gender, dob: body?.dob ?? db.profile.dob };
    return ok({ message: "Profile updated", user: db.profile });
  }],
  ["GET", /^preferences$/, (_, __, db) => ok({ preferences: db.preferences })],
  ["PATCH", /^preferences$/, (_, body, db) => {
    for (const key of Object.keys(DEFAULT_PREFERENCES)) {
      if (typeof body?.[key] === "boolean") db.preferences[key] = body[key];
    }
    return ok({ message: "Preferences saved", preferences: db.preferences });
  }],
  ["DELETE", /^account$/, (_, __, db) => {
    Object.assign(db, emptyDb());
    return ok({ message: "Account deleted" });
  }],

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
  ["PATCH", /^address\/([^/]+)\/default$/, (id, __, db) => {
    if (!db.addresses.some((a) => a._id === id)) return fail(404, "Address not found");
    db.addresses.forEach((a) => { a.defaultAddress = a._id === id; });
    return ok({ message: "Default address updated" });
  }],
  ["PATCH", /^address\/([^/]+)$/, (id, body, db) => {
    const address = db.addresses.find((a) => a._id === id);
    if (!address) return fail(404, "Address not found");
    Object.assign(address, body, { _id: id, defaultAddress: address.defaultAddress });
    if (body?.defaultAddress) db.addresses.forEach((a) => { a.defaultAddress = a._id === id; });
    return ok({ message: "Address updated", address });
  }],
  ["DELETE", /^address\/([^/]+)$/, (id, __, db) => {
    const removed = db.addresses.find((a) => a._id === id);
    db.addresses = db.addresses.filter((a) => a._id !== id);
    // Keep one default address when the default is deleted
    if (removed?.defaultAddress && db.addresses.length) db.addresses[0].defaultAddress = true;
    return ok({ message: "Address deleted" });
  }],
  ["GET", /^order\/initiate$/, (_, __, db) => ok({ data: summarizeCart(db) })],
  ["GET", /^order$/, (_, __, db) => ok({ orders: [...db.orders].reverse().map((o) => presentOrder(o)) })],
  ["GET", /^order\/([^/]+)$/, (id, __, db) => {
    const order = db.orders.find((o) => o._id === id);
    return order ? ok({ order: presentOrder(order) }) : fail(404, "Order not found");
  }],
  ["PATCH", /^order\/([^/]+)\/cancel$/, (id, body, db) => {
    const order = db.orders.find((o) => o._id === id);
    if (!order) return fail(404, "Order not found");
    if (!presentOrder(order).canCancel) return fail(409, "This order can no longer be cancelled");
    order.cancelledAt = new Date().toISOString();
    order.cancelReason = body?.reason || "";
    return ok({ message: "Order cancelled", order: presentOrder(order) });
  }],
  ["POST", /^order$/, (_, body, db) => {
    const address = db.addresses.find((a) => a._id === body?.addressId);
    if (!address) return fail(400, "Choose a delivery address");
    const { orderItems, totalAmount } = summarizeCart(db);
    if (orderItems.length === 0) return fail(400, "Your cart is empty");
    const order = {
      _id: `ORD${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      paymentMethod: body.paymentMethod === "cod" ? "cod" : "online",
      address,
      items: orderItems,
      totalAmount,
    };
    db.orders.push(order);
    db.cart = [];
    return ok({ message: "Order placed", order: presentOrder(order) });
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
