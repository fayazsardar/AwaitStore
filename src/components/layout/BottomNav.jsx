import { NavLink } from "react-router-dom";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import useCartCount from "../../features/cart/hooks/useCartCount";

const tabClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${isActive ? "text-[#26457f] font-semibold" : "text-gray-500"}`;

// App-style tab bar for phones; hidden on md+ screens.
const BottomNav = ({ onCartClick }) => {
  const cartCount = useCartCount();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-white md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main"
    >
      <NavLink to="/" end className={tabClass}>
        <Home className="h-5 w-5" /> Home
      </NavLink>
      <NavLink to="/search" className={tabClass}>
        <Search className="h-5 w-5" /> Search
      </NavLink>
      <button onClick={onCartClick} className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs text-gray-500">
        <ShoppingCart className="h-5 w-5" /> Cart
        {cartCount > 0 && (
          <span className="absolute left-1/2 top-1 ml-1.5 min-w-4 rounded-full bg-gray-900 px-1 text-[10px] font-medium leading-4 text-white">
            {cartCount}
          </span>
        )}
      </button>
      <NavLink to="/profile" className={tabClass}>
        <User className="h-5 w-5" /> Account
      </NavLink>
    </nav>
  );
};

export default BottomNav;
