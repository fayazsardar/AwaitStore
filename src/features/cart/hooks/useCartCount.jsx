import { useSelector } from "react-redux";
import { useGetCartQuery } from "../api/cartApi";

// Total quantity in the guest cart or the logged-in user's cart.
const useCartCount = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const guestItems = useSelector((state) => state.cart.items);
  const { data: userCart } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const cartItems = isAuthenticated ? (userCart?.data?.items || []) : guestItems;
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
};

export default useCartCount;
