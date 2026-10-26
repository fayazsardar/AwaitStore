import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import logo from "../assets/logo/awaitstore-logo.svg";

const CheckOutLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            className="-ml-2 rounded-full p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to="/" aria-label="AwaitStore home">
            <img src={logo} alt="" width="22" height="26" className="h-[26px] w-[22px]" />
          </Link>
          <h1 className="text-lg font-bold">Checkout</h1>
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <Lock className="h-3.5 w-3.5" /> Secure checkout
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-32 pt-4">
        <Outlet />
      </main>
      {/* The fixed "Place order" bar is rendered by CheckOutPage */}
    </div>
  );
};

export default CheckOutLayout;
