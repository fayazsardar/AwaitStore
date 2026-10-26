import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, ChevronRight, Minus, Plus, RotateCcw, ShoppingBag, Truck, Wallet, Zap } from "lucide-react";
import { useGetFullProductDetailsQuery } from "../api/productsApi";
import { useFetchProductsByCategoryQuery } from "../../../pages/category/api/categoryPageApi";
import { useGetSubCategoriesQuery } from "../../../pages/home/api/productHomeApi";
import useAddToCart from "../../cart/hooks/useAddToCart";
import ProductDetailSkeleton from "../components/skeletons/ProductDetailSkeleton";
import ProductGrid from "../components/ProductGrid";
import Rating from "../../../components/common/Rating";
import { discountPercent, formatPrice } from "../../../utils/format";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const PROMISES = [
  { icon: Truck, title: "Free delivery", text: "Ships in 24 hours" },
  { icon: Wallet, title: "Cash on delivery", text: "Pay when it arrives" },
  { icon: RotateCcw, title: "7-day returns", text: "On sealed packs" },
  { icon: BadgeCheck, title: "100% authentic", text: "Lab-tested" },
];

const optionClass = (active) =>
  `rounded-xl border px-4 py-2 text-sm font-medium transition ${
    active ? "border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
  }`;

// Remount per product so selection state resets when moving to a related product
const ProductDetailRoute = () => {
  const { id } = useParams();
  return <ProductDetail key={id} id={id} />;
};

const ProductDetail = ({ id }) => {
  const navigate = useNavigate();
  const { data: product, isLoading: productDetailsLoading } = useGetFullProductDetailsQuery(id);
  const { data: related } = useFetchProductsByCategoryQuery(product?.categoryId, { skip: !product?.categoryId });
  const { data: categoryData } = useGetSubCategoriesQuery();
  const { addToCart, isLoading } = useAddToCart();

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  useDocumentTitle(product?.name);

  if (productDetailsLoading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="page py-20 text-center">
        <p className="text-lg font-semibold">Product not found</p>
        <Link to="/search" className="mt-4 inline-block text-brand-700 hover:underline">Browse all products</Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const selectedVariant =
    variants.find((v) => v._id === (selectedVariantId ?? product.defaultVariantId)) || variants[0] || null;
  const price = selectedVariant?.price ?? product.price;
  const mrp = selectedVariant?.mrp;
  const discount = discountPercent(price, mrp);
  const maxQty = Math.min(selectedVariant?.stock ?? 10, 10);
  const lowStock = selectedVariant?.stock != null && selectedVariant.stock <= 12;

  const flavors = [...new Set(variants.map((v) => v.flavor).filter(Boolean))];
  const sizes = variants.filter((v) => !selectedVariant?.flavor || v.flavor === selectedVariant.flavor);

  const gallery = [...(selectedVariant?.images || []), ...(product.images || []).filter((img) => !selectedVariant?.images?.includes(img))];
  const shownImage = gallery.includes(mainImage) ? mainImage : gallery[0];

  const category = categoryData?.categories?.find((c) => c._id === product.categoryId);
  const relatedProducts = (related?.data || []).filter((p) => p._id !== product._id);

  const selectVariant = (variant) => {
    setSelectedVariantId(variant._id);
    setMainImage(null);
    setQuantity(1);
  };

  const selectFlavor = (flavor) => {
    const sameSize = variants.find((v) => v.flavor === flavor && v.weight === selectedVariant?.weight);
    selectVariant(sameSize || variants.find((v) => v.flavor === flavor));
  };

  const handleAddToCart = () => addToCart(product, selectedVariant, quantity);
  const handleBuyNow = async () => {
    if (await addToCart(product, selectedVariant, quantity, { silent: true })) navigate("/checkout");
  };

  return (
    <div className="pb-24 md:pb-0">
      <div className="page py-4 sm:py-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 overflow-hidden whitespace-nowrap text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          {category && (
            <>
              <Link to={`/categories/${category._id}`} className="hover:text-gray-900">{category.name}</Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </>
          )}
          <span className="truncate font-medium text-gray-900">{product.name}</span>
        </nav>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div className="md:sticky md:top-32 md:self-start">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gray-100/70">
              <img src={shownImage} alt={product.name} width="400" height="400" fetchPriority="high" className="h-full w-full object-contain p-6" />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    aria-label={`Show image ${i + 1}`}
                    className={`h-16 w-16 overflow-hidden rounded-xl bg-gray-100/70 ring-2 transition sm:h-20 sm:w-20 ${img === shownImage ? "ring-brand-700" : "ring-transparent hover:ring-gray-300"}`}
                  >
                    <img src={img} alt="" width="80" height="80" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.tag && (
              <span className="mb-2 inline-block rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-700">{product.tag}</span>
            )}
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{product.name}</h1>
            <div className="mt-2">
              <Rating value={product.rating} count={product.reviews} size="lg" />
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-extrabold">{formatPrice(price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-gray-500 line-through">MRP {formatPrice(mrp)}</span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-bold text-emerald-700">{discount}% off</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Inclusive of all taxes{discount > 0 && <> · You save <strong className="text-emerald-700">{formatPrice(mrp - price)}</strong></>}
              </p>
            </div>

            {/* Flavour Selector */}
            {flavors.length > 0 && (
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-semibold">
                  Flavour: <span className="font-normal text-gray-600">{selectedVariant?.flavor}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {flavors.map((flavor) => (
                    <button key={flavor} onClick={() => selectFlavor(flavor)} className={optionClass(selectedVariant?.flavor === flavor)} aria-pressed={selectedVariant?.flavor === flavor}>
                      {flavor}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Size Selector */}
            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-semibold">Size</legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((variant) => {
                  const off = discountPercent(variant.price, variant.mrp);
                  return (
                    <button
                      key={variant._id}
                      onClick={() => selectVariant(variant)}
                      className={`${optionClass(selectedVariant?._id === variant._id)} text-left`}
                      aria-pressed={selectedVariant?._id === variant._id}
                    >
                      <span className="block">{variant.weight} {variant.weightType}</span>
                      <span className="block text-xs font-normal text-gray-600">
                        {formatPrice(variant.price)}{off > 0 && <span className="ml-1 font-semibold text-emerald-700">{off}% off</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Quantity + actions */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-gray-200 bg-white">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold" aria-live="polite">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40" aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {lowStock && <p className="text-sm font-medium text-accent-700">Only {selectedVariant.stock} left in stock</p>}
            </div>

            <div className="mt-5 hidden gap-3 md:flex">
              <button onClick={handleAddToCart} disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-60">
                <ShoppingBag className="h-5 w-5" /> Add to cart
              </button>
              <button onClick={handleBuyNow} disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-700 py-3.5 font-semibold text-white shadow-sm transition hover:bg-accent-800 disabled:opacity-60">
                <Zap className="h-5 w-5" /> Buy now
              </button>
            </div>

            {/* Promises */}
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {PROMISES.map(({ icon, title, text }) => { const Icon = icon; return (
                <li key={title} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-gray-200/80">
                  <Icon className="h-5 w-5 shrink-0 text-brand-700" />
                  <span className="min-w-0 text-xs">
                    <span className="block font-semibold text-gray-900">{title}</span>
                    <span className="block truncate text-gray-500">{text}</span>
                  </span>
                </li>
              ); })}
            </ul>

            {/* Details */}
            <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200/80 bg-white shadow-card">
              <details open className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  Description <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm leading-6 text-gray-600">{product.description}</p>
              </details>
              {product.howtoUse && (
                <details className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    How to use <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{product.howtoUse}</p>
                </details>
              )}
              {(product.countryInfo || product.manufactureInfo || product.importerInfo) && (
                <details className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    Product information <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
                  </summary>
                  <dl className="mt-2 space-y-1 text-sm text-gray-600">
                    {product.countryInfo && <div><dt className="inline font-medium text-gray-900">Country of origin: </dt><dd className="inline">{product.countryInfo}</dd></div>}
                    {product.manufactureInfo && <div><dt className="inline font-medium text-gray-900">Manufacturer: </dt><dd className="inline">{product.manufactureInfo}</dd></div>}
                    {product.importerInfo && <div><dt className="inline font-medium text-gray-900">Importer: </dt><dd className="inline">{product.importerInfo}</dd></div>}
                  </dl>
                </details>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-14" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">You may also like</h2>
            <ProductGrid products={relatedProducts} layout="rail" />
          </section>
        )}
      </div>

      {/* Mobile sticky buy bar (sits above the bottom tab bar) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-tight">{formatPrice(price * quantity)}</p>
            {discount > 0 && <p className="text-xs font-semibold text-emerald-700">{discount}% off</p>}
          </div>
          <button onClick={handleAddToCart} disabled={isLoading} className="ml-auto flex items-center justify-center gap-1.5 rounded-xl border border-brand-700 px-4 py-3 text-sm font-semibold text-brand-700 disabled:opacity-60" aria-label="Add to cart">
            <ShoppingBag className="h-4 w-4" /> Add
          </button>
          <button onClick={handleBuyNow} disabled={isLoading} className="flex items-center justify-center gap-1.5 rounded-xl bg-accent-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailRoute;
