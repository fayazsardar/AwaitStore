import React from "react";
import { ProductCard } from "./ProductCard";
import { ProductCardShimmer } from "./skeletons/ProductCardShimmer";
import NoDataFoundBox from "../../../components/common/NoDataFoundBox";

// layout="grid": responsive grid. layout="rail": one horizontally scrolling row.
const ProductGrid = ({ products, isLoading, layout = "grid", skeletons = 4, eagerCount = 0, empty }) => {
  const rail = layout === "rail";
  const wrapper = rail
    ? "-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0"
    : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5";
  const item = rail ? "w-[46%] shrink-0 snap-start sm:w-52 lg:w-auto" : "";

  if (!isLoading && (!products || products.length === 0)) {
    return empty ?? (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
        <NoDataFoundBox />
      </div>
    );
  }

  return (
    <div className={wrapper}>
      {isLoading
        ? Array.from({ length: skeletons }, (_, i) => (
            <div key={i} className={item}>
              <ProductCardShimmer />
            </div>
          ))
        : products.map((p, i) => (
            <div key={p._id} className={item}>
              <ProductCard product={p} eager={i < eagerCount} />
            </div>
          ))}
    </div>
  );
};

export default ProductGrid;
