// CartDrawer.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Truck, X } from "lucide-react";
import { removeGuestItem, updateGuestQty } from "../../../store/slices/cartSlice";
import { closeCart } from "../../../store/slices/uiSlice";
import { useGetCartQuery, useRemoveItemFromCartMutation, useUpdateCartItemMutation } from "../api/cartApi";
import CartItemBox from "./cartItemsBox";
import { formatPrice } from "../../../utils/format";

// Opened/closed through the ui slice (openCart / closeCart), so any component can open it.
const CartDrawer = () => {
  const open = useSelector((state) => state.ui.cartOpen);
  const [shouldRender, setShouldRender] = useState(open);
  const [animate, setAnimate] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onClose = () => dispatch(closeCart());

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const guestItems = useSelector((state) => state.cart.items);
  const { data: userCart } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [removeItemFromCart] = useRemoveItemFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const items = isAuthenticated ? userCart?.data?.items || [] : guestItems;
  const lines = items.map((item) => {
    const variant = isAuthenticated ? item.variantId : item.selectedVariant;
    return { item, variant, id: variant?._id ?? item._id };
  });

  const handleToCheckOut = () => {
    onClose();
    navigate('/checkout');
  };

  const handleRemove = async (id) => {
    setLoadingItemId(id);
    try {
      if (isAuthenticated) await removeItemFromCart(id).unwrap();
      else dispatch(removeGuestItem(id));
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleQtyChange = async (id, newQty) => {
    if (newQty < 1) return;
    setLoadingItemId(id);
    try {
      if (isAuthenticated) await updateCartItem({ variantId: id, quantity: newQty }).unwrap();
      else dispatch(updateGuestQty({ _id: id, qty: newQty }));
    } finally {
      setLoadingItemId(null);
    }
  };

  // Drawer animation, body scroll lock and Escape to close
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setAnimate(true));
      const onKey = (e) => e.key === "Escape" && dispatch(closeCart());
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    setAnimate(false);
    document.body.style.overflow = "";
    const timeout = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(timeout);
  }, [open, dispatch]);

  // Cleanup on unmount
  useEffect(() => () => {
    document.body.style.overflow = "";
  }, []);

  if (!shouldRender) return null;

  const priceOf = ({ item, variant }) => variant?.price ?? item.price ?? 0;
  const total = lines.reduce((sum, l) => sum + priceOf(l) * l.item.quantity, 0);
  const mrpTotal = lines.reduce((sum, l) => sum + Math.max(l.variant?.mrp ?? 0, priceOf(l)) * l.item.quantity, 0);
  const savings = mrpTotal - total;
  const count = lines.reduce((sum, l) => sum + l.item.quantity, 0);
  const isAnyLoading = loadingItemId !== null;

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <aside
        className={`relative ml-auto flex h-dvh w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-md ${animate ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold">
            Your cart {count > 0 && <span className="text-sm font-medium text-gray-500">({count} item{count === 1 ? "" : "s"})</span>}
          </h2>
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900" onClick={onClose} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
              <ShoppingBag className="h-9 w-9 text-brand-600" />
            </div>
            <div>
              <p className="text-base font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-gray-500">Add protein, vitamins and more to get started.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/search");
              }}
              className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 bg-emerald-50 px-5 py-2.5 text-sm text-emerald-800">
              <Truck className="h-4 w-4 shrink-0" />
              <span>Yay! Your order ships for <strong>free</strong>.</span>
            </div>

            {/* Items */}
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {lines.map((line) => (
                <CartItemBox
                  key={line.id}
                  item={line.item}
                  variant={line.variant}
                  id={line.id}
                  isLoading={loadingItemId === line.id}
                  handleQtyChange={handleQtyChange}
                  handleRemove={handleRemove}
                />
              ))}
            </ul>

            {/* Footer */}
            <div className="space-y-3 border-t border-gray-100 px-5 py-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal (MRP)</dt>
                  <dd>{formatPrice(mrpTotal)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>You save</dt>
                    <dd>−{formatPrice(savings)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <dt>Delivery</dt>
                  <dd className="font-medium text-emerald-700">FREE</dd>
                </div>
                <div className="flex justify-between pt-1 text-base font-bold text-gray-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <button
                onClick={handleToCheckOut}
                disabled={isAnyLoading}
                className="w-full rounded-xl bg-brand-700 px-4 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Checkout · {formatPrice(total)}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
