import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, RotateCcw, Truck, Wallet } from "lucide-react";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import ProductGrid from "../../features/products/components/ProductGrid";
import { useGetFeaturedProductsQuery, useGetSubCategoriesQuery } from "./api/productHomeApi";
import useDocumentTitle from "../../utils/useDocumentTitle";

const TRUST = [
  { icon: Truck, title: "Free delivery", text: "On every order" },
  { icon: BadgeCheck, title: "100% authentic", text: "Lab-tested products" },
  { icon: Wallet, title: "Cash on delivery", text: "UPI & cards too" },
  { icon: RotateCcw, title: "Easy returns", text: "Within 7 days" },
];

const SectionHeader = ({ title, to, id }) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <h2 id={id} className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
    {to && (
      <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900">
        View all <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

const Home = () => {
  useDocumentTitle(null);
  const { data: featuredProducts, isLoading: loadingProducts } = useGetFeaturedProductsQuery();
  const { data: categories, isLoading: loadingCategories } = useGetSubCategoriesQuery();

  const products = featuredProducts?.data?.products || [];
  const bestsellers = [...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 10);
  const deals = products.filter((p) => (p.price ?? p.defaultPrice) < 1000);

  return (
    <div className="page space-y-12 py-4 sm:py-6 lg:space-y-16">
      <HeroSection products={bestsellers} />

      {/* Trust badges */}
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TRUST.map(({ icon, title, text }) => { const Icon = icon; return (
          <li key={title} className="flex items-center gap-2.5 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-card sm:gap-3 sm:p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 sm:h-10 sm:w-10">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block whitespace-nowrap text-xs font-semibold sm:text-sm">{title}</span>
              <span className="hidden truncate text-xs text-gray-500 sm:block">{text}</span>
            </span>
          </li>
        ); })}
      </ul>

      <CategorySection CategorySectionData={categories?.categories} isLoading={loadingCategories} />

      <section aria-labelledby="bestsellers-heading">
        <SectionHeader id="bestsellers-heading" title="Bestsellers" to="/search" />
        <ProductGrid products={bestsellers} isLoading={loadingProducts} layout="rail" skeletons={5} eagerCount={2} />
      </section>

      {/* Promo banners */}
      <section className="grid gap-4 md:grid-cols-2" aria-label="Offers">
        <Link
          to="/categories/cat-protein"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-700 to-accent-800 p-6 text-white sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-white/90">Protein week</p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">Up to 25% off<br />whey & plant protein</p>
          <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent-700 transition group-hover:gap-2">
            Shop protein <ArrowRight className="h-4 w-4" />
          </span>
          <span aria-hidden="true" className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/15" />
        </Link>
        <Link
          to="/product-detail/p-creatine"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-brand-900 p-6 text-white sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Top rated</p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">Creatine<br />from ₹799</p>
          <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition group-hover:gap-2">
            Get stronger <ArrowRight className="h-4 w-4" />
          </span>
          <span aria-hidden="true" className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
        </Link>
      </section>

      <section aria-labelledby="deals-heading">
        <SectionHeader id="deals-heading" title="Deals under ₹999" to="/search" />
        <ProductGrid products={deals} isLoading={loadingProducts} skeletons={5} />
      </section>
    </div>
  );
};

export default Home;
