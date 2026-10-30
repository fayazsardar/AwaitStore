import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronRight, LogOut, MapPin, Package, Truck } from "lucide-react";
import { useGetAddressesQuery, useGetOrdersQuery } from "../api/accountApi";
import { ACCOUNT_NAV } from "../accountNav";
import useLogout from "../hooks/useLogout";
import UserAvatar from "../components/UserAvatar";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { formatDate } from "../utils/orderStatus";
import { formatPrice } from "../../../utils/format";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const Stat = ({ icon, label, value, to }) => {
  const Icon = icon;
  return (
    <Link to={to} className="group rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card transition hover:shadow-lift">
      <Icon className="h-5 w-5 text-brand-700" />
      <p className="mt-3 text-2xl font-extrabold">{value ?? "–"}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </Link>
  );
};

const AccountOverview = () => {
  useDocumentTitle("My account");
  const user = useSelector((state) => state.auth.user);
  const handleLogout = useLogout();
  const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery();
  const { data: addresses } = useGetAddressesQuery();

  const active = orders?.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const latest = orders?.[0];

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <section className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-900 to-brand-700 p-5 text-white sm:p-7">
        <span className="rounded-full ring-4 ring-white/20">
          <UserAvatar user={user} size="lg" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-brand-200">Hello,</p>
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{user?.name || "Shopper"}</h1>
          <p className="truncate text-sm text-brand-100">{[user?.mobileNumber, user?.email].filter(Boolean).join(" · ")}</p>
        </div>
        <Link to="/account/profile" className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 hover:bg-white/20 sm:inline-block">
          Edit profile
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3" aria-label="Summary">
        <Stat icon={Package} label="Orders" value={orders?.length} to="/account/orders" />
        <Stat icon={Truck} label="In progress" value={active} to="/account/orders?status=active" />
        <Stat icon={MapPin} label="Addresses" value={addresses?.length} to="/account/addresses" />
      </section>

      {/* Latest order */}
      <section aria-labelledby="latest-order">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="latest-order" className="text-lg font-bold">Latest order</h2>
          {orders?.length > 0 && (
            <Link to="/account/orders" className="text-sm font-semibold text-brand-700 hover:text-brand-900">View all</Link>
          )}
        </div>
        {loadingOrders ? (
          <div className="skeleton h-28 rounded-2xl" />
        ) : latest ? (
          <Link
            to={`/account/orders/${latest._id}`}
            className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card transition hover:shadow-lift"
          >
            <img src={latest.items[0]?.image} alt="" width="64" height="64" className="h-16 w-16 shrink-0 rounded-xl bg-gray-50 object-contain p-1" />
            <div className="min-w-0 flex-1">
              <OrderStatusBadge status={latest.status} />
              <p className="mt-1.5 truncate text-sm font-semibold">
                {latest.items[0]?.productName}
                {latest.items.length > 1 && <span className="font-normal text-gray-500"> + {latest.items.length - 1} more</span>}
              </p>
              <p className="text-xs text-gray-500">#{latest._id} · {formatDate(latest.createdAt)} · {formatPrice(latest.totalAmount)}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
            <p className="text-sm text-gray-600">No orders yet.</p>
            <Link to="/search" className="mt-3 inline-block rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">
              Start shopping
            </Link>
          </div>
        )}
      </section>

      {/* Section menu (phones; desktop uses the sidebar) */}
      <nav aria-label="Account sections" className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-card md:hidden">
        <ul className="divide-y divide-gray-100">
          {ACCOUNT_NAV.filter((item) => !item.end).map(({ to, label, description, icon }) => {
            const Icon = icon;
            return (
              <li key={to}>
                <Link to={to} className="flex items-center gap-3 px-4 py-3.5 active:bg-gray-50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block truncate text-xs text-gray-500">{description}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              </li>
            );
          })}
          <li>
            <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-red-600 active:bg-red-50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <LogOut className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">Log out</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AccountOverview;
