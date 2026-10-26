import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import Rating from "../../../components/common/Rating";
import useAddToCart from "../../cart/hooks/useAddToCart";
import { discountPercent, formatPrice, variantLabel } from "../../../utils/format";

const TAG_STYLES = {
  Bestseller: "bg-accent-700 text-white",
  "Top rated": "bg-amber-400 text-amber-950",
  New: "bg-brand-700 text-white",
  Vegan: "bg-emerald-700 text-white",
};

export const ProductCard = ({ product, eager = false }) => {
  const { addToCart, isLoading } = useAddToCart();
  const [added, setAdded] = useState(false);

  // Normalize data (fallbacks for different API shapes)
  const price = product.price ?? product.defaultPrice ?? 0;
  const mrp = product.mrp ?? product.defaultMrp ?? null;
  const image = product.defaultThumbnail ?? null;
  const discount = discountPercent(price, mrp);
  const href = `/product-detail/${product._id}`;
  const variant = product.defaultVariant;

  const handleQuickAdd = async () => {
    if (await addToCart(product, variant)) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <Link to={href} className="relative block aspect-square bg-gray-50" aria-label={product.name}>
        <img
          src={image || "/icons/icon-512.png"}
          alt=""
          width="400"
          height="400"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
        />
        {product.tag && (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_STYLES[product.tag] || "bg-gray-900 text-white"}`}
          >
            {product.tag}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Rating value={product.rating} count={product.reviews} />
        <Link to={href} className="min-h-10">
          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-gray-900 hover:text-brand-700">{product.name}</h3>
        </Link>
        <p className="truncate text-xs text-gray-500">{variantLabel(product) || " "}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-base font-bold text-gray-900">{formatPrice(price)}</span>
              {discount > 0 && <span className="text-xs text-gray-500 line-through">{formatPrice(mrp)}</span>}
            </div>
            {discount > 0 && <span className="text-xs font-semibold text-emerald-700">{discount}% off</span>}
          </div>

          {variant && (
            <button
              onClick={handleQuickAdd}
              disabled={isLoading}
              aria-label={`Add ${product.name} to cart`}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition active:scale-95 ${added ? "bg-emerald-600" : "bg-brand-700 hover:bg-brand-800"}`}
            >
              {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
