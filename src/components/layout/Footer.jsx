import { Link } from "react-router-dom";
import { Download, ShieldCheck, Truck, Wallet } from "lucide-react";
import logo from '../../assets/logo/awaitstore-logo.svg';
import { useGetSubCategoriesQuery } from "../../pages/home/api/productHomeApi";
import useInstallPrompt from "../pwa/useInstallPrompt";

const linkClass = "text-gray-400 transition hover:text-white";

const Footer = () => {
  const { data } = useGetSubCategoriesQuery();
  const categories = data?.categories || [];
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <footer className="mt-16 bg-brand-950 text-gray-300">
      <div className="page grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="mb-4 flex items-center gap-2">
            <img src={logo} alt="" width="30" height="36" className="h-9 w-[30px]" loading="lazy" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              Await<span className="text-accent-500">Store</span>
            </span>
          </Link>
          <p className="max-w-xs text-sm text-gray-400">
            Your trusted source for supplements, vitamins, and nutrition essentials.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent-500" /> Free delivery on every order</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent-500" /> 100% authentic products</li>
            <li className="flex items-center gap-2"><Wallet className="h-4 w-4 text-accent-500" /> UPI, cards & cash on delivery</li>
          </ul>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search" className={linkClass}>All products</Link></li>
            {categories.map((c) => (
              <li key={c._id}><Link to={`/categories/${c._id}`} className={linkClass}>{c.name}</Link></li>
            ))}
          </ul>
        </div>

        {/* Help Links */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/account/orders" className={linkClass}>My orders</Link></li>
            <li><Link to="/policies/contact-us" className={linkClass}>Contact us</Link></li>
            <li><Link to="/policies/shipping-delivery" className={linkClass}>Shipping & delivery</Link></li>
            <li><Link to="/policies/cancellation-refund" className={linkClass}>Cancellation & refunds</Link></li>
            <li><Link to="/policies/terms" className={linkClass}>Terms & conditions</Link></li>
          </ul>
        </div>

        {/* App */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Get the app</h3>
          <p className="mb-4 text-sm text-gray-400">
            Install AwaitStore on your phone or computer. It opens instantly and works offline.
          </p>
          {canInstall && (
            <button
              onClick={promptInstall}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
            >
              <Download className="h-4 w-4" /> Install app
            </button>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <p className="page py-5 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} AwaitStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
