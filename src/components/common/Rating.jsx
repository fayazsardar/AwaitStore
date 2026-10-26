import { Star } from "lucide-react";
import { formatCount } from "../../utils/format";

const Rating = ({ value, count, size = "sm" }) => {
  if (!value) return null;
  const big = size === "lg";
  return (
    <div className={`flex items-center gap-1.5 ${big ? "text-sm" : "text-xs"}`}>
      <span
        className={`inline-flex items-center gap-0.5 rounded-md bg-emerald-700 font-semibold text-white ${big ? "px-2 py-0.5" : "px-1.5 py-px"}`}
      >
        {value.toFixed(1)}
        <Star className={`${big ? "h-3.5 w-3.5" : "h-3 w-3"} fill-current`} aria-hidden="true" />
      </span>
      {count != null && <span className="text-gray-500">({formatCount(count)}{big ? " reviews" : ""})</span>}
    </div>
  );
};

export default Rating;
