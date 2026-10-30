import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { useGetOrdersQuery } from "../api/accountApi";
import AccountPageHeader from "../components/AccountPageHeader";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { ORDER_FILTERS, formatDate } from "../utils/orderStatus";
import { formatPrice } from "../../../utils/format";

const MAX_THUMBS = 4;

const OrderCard = ({ order }) => {
  const extra = order.items.length - MAX_THUMBS;
  const first = order.items[0];
  const deliveredOrDone = ["delivered", "cancelled"].includes(order.status);

  return (
    <Link
      to={`/account/orders/${order._id}`}
      className="block rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card transition hover:shadow-lift sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <OrderStatusBadge status={order.status} />
        <p className="text-xs text-gray-500">
          #{order._id} · {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex shrink-0 -space-x-3">
          {order.items.slice(0, MAX_THUMBS).map((item) => (
            <img
              key={item.variantId}
              src={item.image}
              alt=""
              width="56"
              height="56"
              loading="lazy"
              className="h-14 w-14 rounded-xl bg-gray-50 object-contain p-1 ring-2 ring-white"
            />
          ))}
          {extra > 0 && (
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-600 ring-2 ring-white">
              +{extra}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {first?.productName}
            {order.items.length > 1 && <span className="font-normal text-gray-500"> + {order.items.length - 1} more</span>}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {order.status === "delivered"
              ? "Delivered"
              : order.status === "cancelled"
                ? "Cancelled"
                : `Arriving by ${formatDate(order.expectedDelivery)}`}
          </p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="font-bold">{formatPrice(order.totalAmount)}</p>
          <p className="text-xs text-gray-500">{order.payment?.method}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm sm:hidden">
        <span className="text-gray-500">{deliveredOrDone ? "Total" : order.payment?.status}</span>
        <span className="font-bold">{formatPrice(order.totalAmount)}</span>
      </div>
    </Link>
  );
};

const OrdersPage = () => {
  const [params, setParams] = useSearchParams();
  const active = ORDER_FILTERS.find((f) => f.key === params.get("status")) || ORDER_FILTERS[0];
  const { data: orders = [], isLoading, isError, refetch } = useGetOrdersQuery();
  const visible = orders.filter(active.match);

  return (
    <div>
      <AccountPageHeader title="My orders" description="Track deliveries, cancel or buy again" />

      <div role="tablist" aria-label="Filter orders" className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
        {ORDER_FILTERS.map((f) => {
          const count = orders.filter(f.match).length;
          const selected = f.key === active.key;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setParams(f.key === "all" ? {} : { status: f.key }, { replace: true })}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
                selected ? "bg-brand-700 text-white ring-brand-700" : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
              {!isLoading && <span className={`ml-1.5 ${selected ? "text-brand-100" : "text-gray-400"}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Couldn't load your orders.{" "}
          <button onClick={refetch} className="font-semibold underline">Try again</button>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <Package className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-3 font-semibold">{orders.length === 0 ? "No orders yet" : `No ${active.label.toLowerCase()} orders`}</p>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length === 0 ? "When you place an order, you can track it here." : "Try another filter."}
          </p>
          {orders.length === 0 && (
            <Link to="/search" className="mt-5 inline-block rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
              Start shopping
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((order) => (
            <li key={order._id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
