import { useState } from "react";
import { USE_MOCK_API } from "../../../app/api/mockBaseQuery";
import { useDispatch } from "react-redux";
import { useVerifyOtpMutation } from "../api/authApi";
import { setCredentials } from "../../../store/slices/authSlice";
import useSyncCartOnLogin from "../../cart/hooks/useSyncCartOnLogin";

const OtpVerify = ({ mobileData }) => {
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const dispatch = useDispatch();
  const syncCart = useSyncCartOnLogin();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ mobile: mobileData, otp }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token }));

      // 🧲 Sync guest cart after setting credentials
      await syncCart();

      console.log("✅ OTP verified and cart synced");
    } catch (err) {
      console.error("❌ OTP verification failed", err);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <h2 className="text-xl font-bold text-center mb-1">Verify OTP</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Sent to {mobileData}{USE_MOCK_API && " · demo mode: any code works"}
      </p>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="h-12 w-full rounded-xl border border-gray-300 px-4 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        autoFocus
      />
      
      <button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-xl bg-brand-700 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};

export default OtpVerify;
