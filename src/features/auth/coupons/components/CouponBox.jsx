import React, { useState } from "react";

// No coupons exist yet: the box accepts a code and says so, instead of claiming one is applied.
const CouponBox = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setMessage(`“${code.trim().toUpperCase()}” isn't a valid coupon right now.`);
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Coupons</h2>
      </div>

      <form className="flex gap-2" onSubmit={handleApply}>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setMessage("");
          }}
          placeholder="Enter coupon code"
          className="min-w-0 flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button type="submit" className="shrink-0 bg-brand-700 text-white px-4 py-2 rounded-lg hover:bg-brand-800 transition">
          Apply
        </button>
      </form>

      {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
    </div>
  );
};

export default CouponBox;
