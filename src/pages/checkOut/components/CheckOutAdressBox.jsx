import { MapPinned } from 'lucide-react'
import React from 'react'

const CheckOutAdressBox = ({ address, onAdd, onChange, isLoading }) => {

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPinned className="text-brand-700 w-6 h-6" />
          <h2 className="font-semibold text-gray-900 text-base">
            Delivery Address
          </h2>
        </div>
        
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        {isLoading ? (
          <p className="text-gray-500 italic">Loading address...</p>
        ) : address ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {address.firstName} {address.lastName}
            </h3>
            <p className="text-gray-600">{address.addressLine}</p>
            <p className="text-gray-600">
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="text-gray-600">Phone: {address.mobileNumber}</p>
            <div className="flex justify-end mt-2">
              <button
                onClick={onChange}
                className="rounded-full border border-brand-700 px-3 py-1 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <p className="text-gray-500 italic">No delivery address yet.</p>
            <button
              onClick={onAdd}
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              + Add delivery address
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckOutAdressBox
