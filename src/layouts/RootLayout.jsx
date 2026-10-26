
import { Outlet } from "react-router-dom";


import { useState } from "react";


import { Navbar, Footer, BottomNav } from "../components/index";
import CartDrawer from "../features/cart/components/CartDrawer";

const RootLayout = () => {

  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      {/* Navbar */}
      <Navbar onCartClick={() => setCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
       
      />

      {/* Page content */}
      <main className="flex-1 p-3">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      <BottomNav onCartClick={() => setCartOpen(true)} />
    </div>
  );
};

export default RootLayout;
