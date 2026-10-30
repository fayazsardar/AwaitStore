// Display rules for order statuses returned by the API (see presentOrder in mockServer.js)
export const ORDER_STATUS = {
  placed: { label: "Order placed", tone: "bg-brand-50 text-brand-800 ring-brand-200" },
  packed: { label: "Packed", tone: "bg-brand-50 text-brand-800 ring-brand-200" },
  shipped: { label: "Shipped", tone: "bg-indigo-50 text-indigo-800 ring-indigo-200" },
  out_for_delivery: { label: "Out for delivery", tone: "bg-amber-50 text-amber-900 ring-amber-200" },
  delivered: { label: "Delivered", tone: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  cancelled: { label: "Cancelled", tone: "bg-red-50 text-red-700 ring-red-200" },
};

// Order list filters: which statuses each tab shows
export const ORDER_FILTERS = [
  { key: "all", label: "All", match: () => true },
  { key: "active", label: "In progress", match: (o) => !["delivered", "cancelled"].includes(o.status) },
  { key: "delivered", label: "Delivered", match: (o) => o.status === "delivered" },
  { key: "cancelled", label: "Cancelled", match: (o) => o.status === "cancelled" },
];

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : "";
