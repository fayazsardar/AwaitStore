const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const formatPrice = (n) => `₹${inr.format(Number(n) || 0)}`;

export const discountPercent = (price, mrp) =>
  mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

export const variantLabel = (v) =>
  [v?.weight && `${v.weight} ${v.weightType ?? ""}`.trim(), v?.flavor].filter(Boolean).join(" · ");
