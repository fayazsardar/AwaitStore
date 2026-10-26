import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addGuestItem } from "../../../store/slices/cartSlice";
import { openCart } from "../../../store/slices/uiSlice";
import { useAddItemToCartMutation } from "../api/cartApi";
import AddedToast from "../components/AddedToast";

// Adds a product variant to the guest cart or the logged-in user's cart.
const useAddToCart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [addItemToCart, { isLoading }] = useAddItemToCartMutation();

  const addToCart = async (product, variant, quantity = 1, { silent = false } = {}) => {
    if (!variant) return false;
    try {
      if (isAuthenticated) {
        await addItemToCart({ variantId: variant._id, quantity }).unwrap();
      } else {
        dispatch(
          addGuestItem({
            _id: variant._id,
            name: product.name,
            selectedVariant: variant,
            price: variant.price,
            image: variant.images?.[0] || product.images?.[0] || product.defaultThumbnail,
            quantity,
          })
        );
      }
      if (!silent) {
        toast.success(<AddedToast name={product.name} onView={() => dispatch(openCart())} />, {
          autoClose: 2500,
        });
      }
      return true;
    } catch (err) {
      toast.error(`Couldn't add to cart: ${err?.data?.message || err?.error || "please try again"}`);
      return false;
    }
  };

  return { addToCart, isLoading };
};

export default useAddToCart;
