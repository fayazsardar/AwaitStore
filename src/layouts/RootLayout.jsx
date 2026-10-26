import { Outlet } from "react-router-dom";
import { Navbar, Footer, BottomNav } from "../components/index";
import CartDrawer from "../features/cart/components/CartDrawer";
import ScrollToTop from "../components/common/ScrollToTop";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <ScrollToTop />
      <Navbar />
      <CartDrawer />

      {/* Page content */}
      <main className="min-h-screen flex-1">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default RootLayout;
