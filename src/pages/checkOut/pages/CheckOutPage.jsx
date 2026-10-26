import React, { useEffect, useState } from 'react'
import CheckOutAdressBox from '../components/CheckOutAdressBox'
import { useGetAddressesQuery } from '../../../features/profile/api/profileApi'
import CheckOutAddressModal from '../components/CheckOutAddressModal'
import CouponBox from '../../../features/auth/coupons/components/CouponBox'
import OrderSummaryAccordion from '../components/OrderSummaryAccordion'
import PaymentSelection from '../components/PaymentSelection'

import { useGetCartQuery } from '../../../features/cart/api/cartApi'
import AddAddressModal from '../../../features/profile/components/AddAddressModal'
import { useInitiateOrderQuery, usePlaceOrderMutation } from '../api/orderApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
      navigate('/profile/orders', { replace: true, state: { placedOrderId: res.order._id } })
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
    return <div className="text-center py-10">Loading checkout data...</div>;
  }

  return (
     <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
        <div>
          <CheckOutAdressBox
          address={selectedAddress}
          onAdd={handelAddAddress}
        onChange={() => setIsModalOpen(true)}
        isLoading={addressLoading}
           />
        </div>

        <div className='mt-2'>

          <CouponBox />

        </div>

      <div className='mt-4'>
        <PaymentSelection selectedMethod={paymentMethod} setSelectedMethod={setPaymentMethod} />
      </div>

       {!cartLoading && <div className='mt-4'><OrderSummaryAccordion cartData={cartData} /></div>}

       {isAddAddressModal && <AddAddressModal
       handelClose={(()=>setIsAddAddressModal(false))} />}
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
        className="fixed bottom-0 left-0 right-0 p-3 bg-blue-900 shadow-inner text-center"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={handlePlaceOrder}
          disabled={placing || itemCount === 0}
          className="py-4 px-6 w-full rounded-lg bg-white cursor-pointer text-blue-950 font-bold text-lg md:w-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {placing
            ? 'Placing order…'
            : itemCount === 0
              ? 'Your cart is empty'
              : `Place order · ₹${summary?.data?.totalAmount ?? 0}${paymentMethod === 'cod' ? ' (COD)' : ''}`}
        </button>
      </div>
    </div>
  )
}

export default CheckOutPage
