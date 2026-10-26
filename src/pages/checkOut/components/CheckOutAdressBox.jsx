import { MapPinned } from 'lucide-react'
import React from 'react'

const CheckOutAdressBox = ({ address, onAdd, onChange, isLoading }) => {

  return (
    <div className="border p-3 rounded-md border-gray-300 bg-gray-50 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPinned className="text-blue-500 w-6 h-6" />
          <h2 className="font-medium text-gray-800 text-base">
            Delivery Address
          </h2>
        </div>
        
      </div>

      <div className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer">
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
                className="px-2 py-0.5 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition"
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
              className="px-3 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition"
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
