import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { Navbar, BottomNav } from "../../../components";
import CartDrawer from "../../cart/components/CartDrawer";
import ScrollToTop from "../../../components/common/ScrollToTop";
import { ACCOUNT_NAV } from "../accountNav";
import useLogout from "../hooks/useLogout";
import UserAvatar from "./UserAvatar";

// Shell for every /account page: sidebar on desktop; on phones the account home
// page lists these sections and each sub-page has its own back button.
const AccountLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <ScrollToTop />
      <Navbar />
      <CartDrawer />

      <div className="page flex gap-8 py-5 md:py-10">
        <aside className="hidden w-64 shrink-0 md:block print:hidden">
          <div className="sticky top-32 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-card">
            <div className="mb-2 flex items-center gap-3 border-b border-gray-100 px-2 pb-4 pt-2">
              <UserAvatar user={user} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{user?.name || "My account"}</p>
                <p className="truncate text-xs text-gray-500">{user?.mobileNumber}</p>
              </div>
            </div>
            <nav aria-label="Account" className="space-y-0.5">
              {ACCOUNT_NAV.map(({ to, label, icon, end }) => {
                const Icon = icon;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive ? "bg-brand-50 text-brand-800" : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </NavLink>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default AccountLayout;
