import React from "react";

// Mirrors the ProductDetail layout so nothing jumps when the product arrives
const ProductDetailSkeleton = () => {
  return (
    <div className="page py-4 sm:py-6" aria-busy="true" aria-label="Loading product">
      <div className="skeleton mb-4 h-5 w-48 rounded" />
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        <div>
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="skeleton h-16 w-16 rounded-xl sm:h-20 sm:w-20" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-24 w-full rounded-2xl" />
          <div className="skeleton h-5 w-24 rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-14 w-24 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
