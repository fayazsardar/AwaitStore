import React from "react";

const PaymentSelection = ({ selectedMethod, setSelectedMethod }) => {

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Payment Method
      </h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="razorpay"
            checked={selectedMethod === "razorpay"}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <span>💳 Pay Online (Razorpay)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={selectedMethod === "cod"}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <span>💵 Cash on Delivery (COD)</span>
        </label>
      </div>
    </div>
  );
};

export default PaymentSelection;
