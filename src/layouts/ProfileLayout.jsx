import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDashboard, LogOut, MapPin, Package } from "lucide-react";
import { Navbar, BottomNav } from "../components";
import CartDrawer from "../features/cart/components/CartDrawer";
import ScrollToTop from "../components/common/ScrollToTop";
import { logout } from "../store/slices/authSlice";
import { clearGuestCart } from "../store/slices/cartSlice";

const ProfileLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(clearGuestCart());
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <ScrollToTop />
      <Navbar />
      <CartDrawer />

      <div className="page flex flex-col gap-6 py-6 md:flex-row md:py-10">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-32 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card">
            <div className="mb-4 flex items-center gap-3 border-b border-gray-100 px-2 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800">
                {(user?.name || "U").charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user?.name || "My account"}</p>
                <p className="truncate text-xs text-gray-500">{user?.mobileNumber}</p>
              </div>
            </div>
            <NavMenu layout="vertical" onLogout={handleLogOut} />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Mobile Tabs */}
          <div className="mb-6 md:hidden">
            <NavMenu layout="tabs" onLogout={handleLogOut} />
          </div>

          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfileLayout;

const ITEMS = [
  { to: "/profile", label: "Overview", icon: LayoutDashboard },
  { to: "/profile/orders", label: "Orders", icon: Package },
  { to: "/profile/addresses", label: "Addresses", icon: MapPin },
];

const NavMenu = ({ layout, onLogout }) => {
  if (layout === "tabs") {
    // Mobile Tabs
    return (
      <nav className="flex gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-card">
        {ITEMS.map((item) => (
          <NavItem key={item.to} {...item} tab />
        ))}
      </nav>
    );
  }

  // Desktop Vertical Menu
  return (
    <nav className="space-y-1">
      {ITEMS.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </nav>
  );
};

const NavItem = ({ to, label, icon, tab }) => {
  const Icon = icon;
  return (
  <NavLink
    to={to}
    end={to === "/profile"}
    className={({ isActive }) =>
      tab
        ? `flex-1 rounded-full px-3 py-2 text-center text-sm font-medium transition ${
            isActive ? "bg-brand-700 text-white" : "text-gray-600 hover:bg-gray-100"
          }`
        : `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            isActive ? "bg-brand-50 text-brand-800" : "text-gray-700 hover:bg-gray-100"
          }`
    }
  >
    {!tab && <Icon className="h-4 w-4" />}
    {label}
  </NavLink>
  );
};
