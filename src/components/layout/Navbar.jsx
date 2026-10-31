import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import logo from "../../assets/logo/awaitstore-logo.svg";
import useCartCount from "../../features/cart/hooks/useCartCount";
import { useGetSubCategoriesQuery } from "../../pages/home/api/productHomeApi";
import { openCart } from "../../store/slices/uiSlice";

const SearchBox = ({ value, onChange, onSubmit, autoFocus, className = "" }) => (
  <form onSubmit={onSubmit} role="search" className={className}>
    <label className="relative block">
      <span className="sr-only">Search products</span>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        className="h-11 w-full rounded-full border border-transparent bg-gray-100 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
        placeholder="Search protein, vitamins, creatine…"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
      />
    </label>
  </form>
);

const Navbar = ({ onCartClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: categoryData } = useGetSubCategoriesQuery();
  const categories = categoryData?.categories || [];
  const cartCount = useCartCount();

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setMobileOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleCart = onCartClick ?? (() => dispatch(openCart()));

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-brand-900 text-white print:hidden">
        <p className="page flex h-8 items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-xs font-medium">
          <span>Free delivery on every order</span>
          <span aria-hidden="true" className="text-brand-300">•</span>
          <span>Cash on delivery</span>
          <span aria-hidden="true" className="hidden text-brand-300 sm:inline">•</span>
          <span className="hidden sm:inline">100% authentic products</span>
        </p>
      </div>

      <header className="sticky top-0 z-40 print:hidden border-b border-gray-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="page flex h-16 items-center gap-3 md:gap-6">
          <button
            className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle search"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="AwaitStore home">
            <img src={logo} alt="" width="30" height="36" className="h-9 w-[30px]" />
            <span className="text-lg font-extrabold tracking-tight text-brand-900">
              Await<span className="text-accent-700">Store</span>
            </span>
          </Link>

          <SearchBox value={q} onChange={(e) => setQ(e.target.value)} onSubmit={onSearch} className="hidden flex-1 md:block md:max-w-xl lg:mx-auto" />

          <div className="ml-auto flex items-center gap-1">
            <NavLink
              to="/account"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:inline-flex"
            >
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">Account</span>
            </NavLink>
            <button
              onClick={handleCart}
              className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-700 px-1 text-[11px] font-bold text-white lg:static lg:ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileOpen && (
          <div className="page pb-3 md:hidden">
            <SearchBox value={q} onChange={(e) => setQ(e.target.value)} onSubmit={onSearch} autoFocus />
          </div>
        )}

        {/* Categories row: fixed height so it doesn't shift the page when categories load */}
        <nav aria-label="Categories" className="border-t border-gray-100">
          <ul className="page flex h-11 items-center gap-1 overflow-x-auto scrollbar-hide">
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${isActive ? "bg-brand-700 text-white" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                All products
              </NavLink>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <NavLink
                  to={`/categories/${cat._id}`}
                  className={({ isActive }) =>
                    `block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${isActive ? "bg-brand-700 text-white" : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  {cat.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
