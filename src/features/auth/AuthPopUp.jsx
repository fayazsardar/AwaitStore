import React, { useState } from "react";
import { X } from "lucide-react"; // optional icon
import Login from "./components/Login";
import OtpVerify from "./components/OtpVerify";


const AuthPopUp = ({ onClose }) => {
    const [otpSent, setOtpSent] = useState(false);
  const [mobileData, setMobileData] = useState(null);
  

  const handleOtpSent = (mobile) => {
    setOtpSent(true);
    
    setMobileData(mobile); // store anything returned from API (e.g. session id)
  };
   
   
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/50 px-0 backdrop-blur-sm sm:items-center sm:px-4">
      {/* Popup container */}
      <div className="relative w-full rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:max-w-sm sm:rounded-3xl sm:pb-6"
        role="dialog"
        aria-modal="true"
        aria-label="Log in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!otpSent ? <Login onOtpSent={handleOtpSent} /> : <OtpVerify mobileData={mobileData} />}
        
      
      </div>
    </div>
  );
};

export default AuthPopUp;
