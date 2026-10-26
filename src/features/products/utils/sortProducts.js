import { discountPercent } from "../../../utils/format";

const priceOf = (p) => p.price ?? p.defaultPrice ?? 0;
const mrpOf = (p) => p.mrp ?? p.defaultMrp ?? 0;

export const SORTS = {
  popular: { label: "Popularity", compare: (a, b) => (b.reviews || 0) - (a.reviews || 0) },
  rating: { label: "Customer rating", compare: (a, b) => (b.rating || 0) - (a.rating || 0) },
  priceLow: { label: "Price: low to high", compare: (a, b) => priceOf(a) - priceOf(b) },
  priceHigh: { label: "Price: high to low", compare: (a, b) => priceOf(b) - priceOf(a) },
  discount: {
    label: "Biggest discount",
    compare: (a, b) => discountPercent(priceOf(b), mrpOf(b)) - discountPercent(priceOf(a), mrpOf(a)),
  },
};

export const sortProducts = (products, sort) => [...products].sort((SORTS[sort] || SORTS.popular).compare);
