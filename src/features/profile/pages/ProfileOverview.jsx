import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronRight, MapPin, Package, ShoppingBag } from "lucide-react";
import { useGetOrdersQuery } from "../../../pages/checkOut/api/orderApi";
import { useGetAddressesQuery } from "../api/profileApi";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const ProfileOverview = () => {
  useDocumentTitle("My account");
  const user = useSelector((state) => state.auth.user);
  const { data: orders = [] } = useGetOrdersQuery();
  const { data: addresses = [] } = useGetAddressesQuery();

  const cards = [
    { to: "/profile/orders", icon: Package, title: "My orders", text: `${orders.length} order${orders.length === 1 ? "" : "s"}` },
    { to: "/profile/addresses", icon: MapPin, title: "Addresses", text: `${addresses.length} saved` },
    { to: "/search", icon: ShoppingBag, title: "Continue shopping", text: "Browse all products" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-900 to-brand-700 p-6 text-white sm:p-8">
        <p className="text-sm text-brand-200">Welcome back</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {user?.firstName || user?.name || user?.mobileNumber || "Shopper"}
        </h1>
        {user?.mobileNumber && <p className="mt-1 text-sm text-brand-100">{user.mobileNumber}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card transition hover:shadow-lift"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{card.title}</span>
                <span className="block text-sm text-gray-500">{card.text}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileOverview;
