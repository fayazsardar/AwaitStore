import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, Printer, RotateCcw, XCircle } from "lucide-react";
import { useCancelOrderMutation, useGetOrderQuery } from "../api/accountApi";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderTimeline from "../components/OrderTimeline";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import useAddToCart from "../../cart/hooks/useAddToCart";
import { openCart } from "../../../store/slices/uiSlice";
import { formatDate } from "../utils/orderStatus";
import { formatPrice } from "../../../utils/format";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price",
  "Delivery is too slow",
  "Want to change address or items",
  "Other",
];

const Card = ({ title, icon, children, className = "" }) => {
  const Icon = icon;
  return (
    <section className={`rounded-2xl border border-gray-200/80 bg-white p-5 shadow-card ${className}`}>
      {title && (
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
          {Icon && <Icon className="h-4 w-4 text-brand-700" />} {title}
        </h2>
      )}
      {children}
    </section>
  );
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const justPlaced = useLocation().state?.justPlaced;
  const dispatch = useDispatch();
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const { addToCart } = useAddToCart();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [reordering, setReordering] = useState(false);
  useDocumentTitle(order ? `Order #${order._id}` : "Order");

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <p className="font-semibold">We couldn't find that order</p>
        <Link to="/account/orders" className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">
          Back to my orders
        </Link>
      </div>
    );
  }

  const handleCancel = async () => {
    try {
      await cancelOrder({ orderId: order._id, reason }).unwrap();
      toast.success("Your order has been cancelled");
      setConfirmOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't cancel the order");
    }
  };

  const handleBuyAgain = async () => {
    setReordering(true);
    let added = 0;
    for (const item of order.items) {
      const variant = {
        _id: item.variantId,
        price: item.price,
        mrp: item.mrp,
        weight: item.weight,
        weightType: item.weightType,
        flavor: item.flavor,
        images: [item.image],
      };
      if (await addToCart({ name: item.productName, images: [item.image] }, variant, item.quantity, { silent: true })) added += 1;
    }
    setReordering(false);
    if (added) {
      toast.success(`${added} item${added === 1 ? "" : "s"} added to your cart`);
      dispatch(openCart());
    }
  };

  const { address, pricing } = order;

  return (
    <div>
      {/* Header */}
      <div className="mb-5 print:mb-3">
        <Link to="/account/orders" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 print:hidden">
          <ArrowLeft className="h-4 w-4" /> All orders
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Order #{order._id}</h1>
            <p className="mt-0.5 text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {justPlaced && (
        <div role="status" className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 print:hidden">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Thank you! Your order is confirmed.</p>
            <p className="text-sm">We'll keep this page updated as it ships.</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mb-5 flex flex-wrap gap-2 print:hidden">
        <button
          onClick={handleBuyAgain}
          disabled={reordering}
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          <RotateCcw className="h-4 w-4" /> {reordering ? "Adding…" : "Buy again"}
        </button>
        {order.canCancel && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" /> Cancel order
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
        >
          <Printer className="h-4 w-4" /> Invoice
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <Card title={order.status === "cancelled" ? "Order cancelled" : "Tracking"} className="print:hidden">
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <p className="mb-4 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-900">
                Arriving by <strong>{formatDate(order.expectedDelivery)}</strong>
              </p>
            )}
            {order.status === "cancelled" && order.cancelReason && (
              <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Reason: {order.cancelReason}</p>
            )}
            <OrderTimeline steps={order.timeline} />
          </Card>

          <Card title={`Items (${order.items.length})`}>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.variantId} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <img src={item.image} alt="" width="64" height="64" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl bg-gray-50 object-contain p-1" />
                  <div className="min-w-0 flex-1">
                    {item.productId ? (
                      <Link to={`/product-detail/${item.productId}`} className="text-sm font-semibold hover:text-brand-700">{item.productName}</Link>
                    ) : (
                      <p className="text-sm font-semibold">{item.productName}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {[`${item.weight} ${item.weightType}`, item.flavor].filter(Boolean).join(" · ")} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(item.subtotal)}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Delivery address" icon={MapPin}>
            <p className="text-sm font-semibold">{address?.firstName} {address?.lastName}</p>
            <p className="mt-1 text-sm text-gray-600">
              {address?.addressLine}
              {address?.landmark ? `, ${address.landmark}` : ""}
              <br />
              {address?.city}, {address?.state} – {address?.pincode}
            </p>
            <p className="mt-1 text-sm text-gray-600">{address?.mobileNumber}</p>
          </Card>

          <Card title="Payment" icon={CreditCard}>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Method</dt><dd className="font-medium">{order.payment?.method}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd className="font-medium">{order.payment?.status}</dd></div>
            </dl>
            {pricing && (
              <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Items (MRP)</dt><dd>{formatPrice(pricing.mrpTotal)}</dd></div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{formatPrice(pricing.discount)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-gray-500">Delivery</dt><dd className="text-emerald-700">FREE</dd></div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(pricing.total)}</dd></div>
              </dl>
            )}
          </Card>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          title="Cancel this order?"
          message={
            order.payment?.method === "Paid online"
              ? "Your refund will be started right away and usually reaches you in 5–7 days."
              : "You won't be charged anything."
          }
          confirmLabel="Cancel order"
          cancelLabel="Keep order"
          isLoading={cancelling}
          onConfirm={handleCancel}
          onCancel={() => setConfirmOpen(false)}
        >
          <label className="block text-sm font-medium text-gray-700">
            Reason
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              {CANCEL_REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
        </ConfirmDialog>
      )}
    </div>
  );
};

export default OrderDetailPage;
