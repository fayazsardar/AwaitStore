import React from "react";
import { ArrowUpDown } from "lucide-react";
import { SORTS } from "../utils/sortProducts";

const SortSelect = ({ value, onChange }) => (
  <label className="relative inline-flex items-center">
    <span className="sr-only">Sort products</span>
    <ArrowUpDown className="pointer-events-none absolute left-3 h-4 w-4 text-gray-500" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 appearance-none rounded-full border border-gray-200 bg-white pl-9 pr-9 text-sm font-medium text-gray-800 shadow-card outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
    >
      {Object.entries(SORTS).map(([key, { label }]) => (
        <option key={key} value={key}>
          Sort: {label}
        </option>
      ))}
    </select>
    <svg className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  </label>
);

export default SortSelect;
