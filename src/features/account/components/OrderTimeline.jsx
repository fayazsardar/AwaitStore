import { Check, X } from "lucide-react";
import { formatDateTime } from "../utils/orderStatus";

// Vertical tracking stepper: completed steps filled, the latest step highlighted
const OrderTimeline = ({ steps = [] }) => {
  const lastDone = steps.reduce((idx, s, i) => (s.done ? i : idx), -1);

  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const cancelled = step.key === "cancelled";
        const isCurrent = i === lastDone;
        const isLast = i === steps.length - 1;
        return (
          <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 ${i < lastDone ? "bg-emerald-600" : "bg-gray-200"}`}
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                cancelled
                  ? "bg-red-600 text-white"
                  : step.done
                    ? "bg-emerald-600 text-white"
                    : "border-2 border-gray-300 bg-white"
              } ${isCurrent && !cancelled ? "ring-4 ring-emerald-100" : ""}`}
            >
              {cancelled ? <X className="h-3.5 w-3.5" /> : step.done && <Check className="h-3.5 w-3.5" />}
            </span>
            <div className="-mt-0.5">
              <p className={`text-sm font-semibold ${step.done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
              {step.at && <p className="text-xs text-gray-500">{formatDateTime(step.at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderTimeline;
