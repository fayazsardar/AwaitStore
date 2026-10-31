import { ORDER_STATUS } from "../utils/orderStatus";

const OrderStatusBadge = ({ status, label }) => {
  const meta = ORDER_STATUS[status] || { label: status, tone: "bg-gray-100 text-gray-700 ring-gray-200" };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.tone}`}>
      {label || meta.label}
    </span>
  );
};

export default OrderStatusBadge;
