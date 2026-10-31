import React, { useEffect, useState } from 'react'
import CheckOutAdressBox from '../components/CheckOutAdressBox'
import { useGetAddressesQuery } from '../../../features/account/api/accountApi'
import CheckOutAddressModal from '../components/CheckOutAddressModal'
import CouponBox from '../../../features/auth/coupons/components/CouponBox'
import OrderSummaryAccordion from '../components/OrderSummaryAccordion'
import PaymentSelection from '../components/PaymentSelection'

import { useGetCartQuery } from '../../../features/cart/api/cartApi'
import AddressFormModal from '../../../features/account/components/AddressFormModal'
import { useInitiateOrderQuery, usePlaceOrderMutation } from '../api/orderApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { formatPrice } from '../../../utils/format'

const CheckOutPage = () => {
   const { data: addressData = [], isLoading:addressLoading } = useGetAddressesQuery()
   const {data:cartData,isLoading:cartLoading}=useGetCartQuery()
   const { data: summary } = useInitiateOrderQuery()
   const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation()
   const navigate = useNavigate()

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddAddressModal,setIsAddAddressModal]=useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  const itemCount = summary?.data?.orderItems?.length || 0

  const handelAddAddress=()=>{
    setIsAddAddressModal(true)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Add a delivery address first')
      return
    }
    try {
      const res = await placeOrder({ addressId: selectedAddress._id, paymentMethod }).unwrap()
      toast.success(`Order ${res.order._id} placed!`)
      navigate(`/account/orders/${res.order._id}`, { replace: true, state: { justPlaced: true } })
    } catch (err) {
      toast.error(err?.data?.message || 'Could not place order')
    }
  }

  // pick the default (or first) address once data loads, keeping the user's choice if it still exists
  useEffect(() => {
    setSelectedAddress((current) =>
      current && addressData.some((a) => a._id === current._id)
        ? current
        : addressData.find((a) => a.defaultAddress) || addressData[0] || null
    )
  }, [addressData])

  if (addressLoading || cartLoading) {
    return <div className="space-y-4" aria-busy="true"><div className="skeleton h-40 rounded-2xl" /><div className="skeleton h-24 rounded-2xl" /><div className="skeleton h-28 rounded-2xl" /></div>;
  }

  return (
     <div className="space-y-4">
        <div>
          <CheckOutAdressBox
          address={selectedAddress}
          onAdd={handelAddAddress}
        onChange={() => setIsModalOpen(true)}
        isLoading={addressLoading}
           />
        </div>

        <CouponBox />

      <PaymentSelection selectedMethod={paymentMethod} setSelectedMethod={setPaymentMethod} />

       {!cartLoading && <OrderSummaryAccordion cartData={cartData} />}

       {isAddAddressModal && <AddressFormModal
       onClose={() => setIsAddAddressModal(false)}
       onSaved={(addr) => addr && setSelectedAddress(addr)} />}
      {isModalOpen && (
        <CheckOutAddressModal
        addresses={addressData}
         onClose={() => setIsModalOpen(false)}
        onSelect={(addr)=>{
          setSelectedAddress(addr),
          setIsModalOpen(false)
        }}
        />
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-md"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={handlePlaceOrder}
          disabled={placing || itemCount === 0}
          className="mx-auto block w-full max-w-2xl rounded-xl bg-brand-700 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {placing
            ? 'Placing order…'
            : itemCount === 0
              ? 'Your cart is empty'
              : `Place order · ${formatPrice(summary?.data?.totalAmount ?? 0)}${paymentMethod === 'cod' ? ' (COD)' : ''}`}
        </button>
      </div>
    </div>
  )
}

export default CheckOutPage
