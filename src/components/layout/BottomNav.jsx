import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openCart } from "../../store/slices/uiSlice";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import useCartCount from "../../features/cart/hooks/useCartCount";

const tabClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isActive ? "text-brand-700" : "text-gray-500"}`;

// App-style tab bar for phones; hidden on md+ screens.
const BottomNav = () => {
  const cartCount = useCartCount();
  const dispatch = useDispatch();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex print:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main"
    >
      <NavLink to="/" end className={tabClass}>
        <Home className="h-5 w-5" /> Home
      </NavLink>
      <NavLink to="/search" className={tabClass}>
        <Search className="h-5 w-5" /> Search
      </NavLink>
      <button onClick={() => dispatch(openCart())} className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-gray-500">
        <ShoppingBag className="h-5 w-5" /> Cart
        {cartCount > 0 && (
          <span className="absolute left-1/2 top-1 ml-1.5 min-w-4 rounded-full bg-accent-700 px-1 text-[10px] font-medium leading-4 text-white">
            {cartCount}
          </span>
        )}
      </button>
      <NavLink to="/account" className={tabClass}>
        <User className="h-5 w-5" /> Account
      </NavLink>
    </nav>
  );
};

export default BottomNav;
