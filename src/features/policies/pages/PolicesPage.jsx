import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const links = [
  { name: "Terms & Conditions", path: "terms" },
  { name: "Cancellation & Refund", path: "cancellation-refund" },
  { name: "Shipping & Delivery", path: "shipping-delivery" },
  { name: "Contact Us", path: "contact-us" },
];

const PolicesPage = () => {
  useDocumentTitle("Help & policies");

  return (
    <div className="page flex flex-col gap-6 py-6 md:flex-row md:py-10">
      <aside className="md:w-64 md:shrink-0">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Help & policies</h2>
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:flex-col md:gap-1 md:px-0">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition md:rounded-xl ${
                    isActive ? "bg-brand-700 text-white md:bg-brand-50 md:text-brand-800" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 md:bg-transparent md:ring-0"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <article className="min-w-0 flex-1 rounded-3xl border border-gray-200/80 bg-white p-6 leading-7 text-gray-700 shadow-card sm:p-8 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:text-gray-900 [&_h2]:mt-6 [&_h2]:font-semibold [&_h2]:text-gray-900">
        <Outlet />
      </article>
    </div>
  );
};

export default PolicesPage;
