import React, { useState } from "react";
import { useSendOtpMutation } from "../api/authApi"; // ✅ use the new mutation

const Login = ({ onOtpSent }) => {
  const [mobile, setMobile] = useState("");
  const [sendOtp, {  isLoading, error }] = useSendOtpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendOtp(mobile).unwrap();
      console.log("OTP Sent Response:", res);
      onOtpSent(mobile); // 👉 tell parent that OTP was sent successfully
    } catch (err) {
      console.error("Failed to send OTP", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-1">Log in or sign up</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Enter your mobile number to continue
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="h-12 w-full rounded-xl border border-gray-300 px-4 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-brand-700 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Get OTP"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error?.data?.message || "Failed to send OTP"}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
