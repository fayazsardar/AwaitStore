// src/features/cart/hooks/useSyncCartOnLogin.js
import { useDispatch, useSelector } from "react-redux";
import { useSyncGuestCartMutation } from "../api/cartApi";
import { clearGuestCart } from "../../../store/slices/cartSlice";
import { useCallback } from "react";

const useSyncCartOnLogin = () => {
  const dispatch = useDispatch();
  const guestCartItems = useSelector((state) => state.cart.items);

  const [syncGuestCart] = useSyncGuestCartMutation();

  /**
   * 🧠 Merge duplicates by variantId
   */
  const mergeCartItems = useCallback((items) => {
    const merged = {};
    for (const item of items) {
      const key = item.selectedVariant?._id || item._id;
      if (!merged[key]) {
        merged[key] = {
          variantId: key,
          quantity: item.quantity,
        };
      } else {
        merged[key].quantity += item.quantity;
      }
    }
    return Object.values(merged);
  }, []);

  /**
   * 🧲 Sync guest cart to user cart
   */
  const syncCart = useCallback(async () => {
    if (!Array.isArray(guestCartItems) || guestCartItems.length === 0) {
      console.log("🛒 No guest items to sync.");
      return;
    }

    const mergedPayload = mergeCartItems(guestCartItems);

    try {
      await syncGuestCart(mergedPayload).unwrap();
      dispatch(clearGuestCart());
      console.log("✅ Guest cart successfully synced to user cart.");
    } catch (err) {
      console.error("❌ Failed to sync guest cart:", err);
    }
  }, [guestCartItems, mergeCartItems, syncGuestCart, dispatch]);

  return syncCart;
};

export default useSyncCartOnLogin;
