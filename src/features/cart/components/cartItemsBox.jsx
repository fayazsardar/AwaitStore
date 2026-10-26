// CartItemBox.jsx
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice, variantLabel } from "../../../utils/format";

const CartItemBox = ({ item, variant, id, isLoading, handleQtyChange, handleRemove }) => {
  const price = variant?.price ?? item.price ?? 0;
  const name = variant?.productId?.name ?? item.name ?? variant?.name;
  const maxQty = variant?.stock ?? 99;

  return (
    <li className={`flex gap-3 py-4 transition-opacity ${isLoading ? "opacity-60" : ""}`}>
      <img
        className="h-20 w-20 shrink-0 rounded-xl bg-gray-50 object-contain p-1"
        src={variant?.images?.[0] ?? item.image ?? ""}
        alt=""
        width="80"
        height="80"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium text-gray-900">{name}</p>
          <button
            onClick={() => handleRemove(id)}
            disabled={isLoading}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove ${name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">{variantLabel(variant)}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-full border border-gray-200">
            <button
              onClick={() => handleQtyChange(id, item.quantity - 1)}
              disabled={isLoading || item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
            <button
              onClick={() => handleQtyChange(id, item.quantity + 1)}
              disabled={isLoading || item.quantity >= maxQty}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-bold text-gray-900">{formatPrice(price * item.quantity)}</p>
        </div>
      </div>
    </li>
  );
};

export default CartItemBox;
