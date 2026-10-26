import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useGetOrdersQuery } from '../../../pages/checkOut/api/orderApi'

const STATUS_STYLES = {
  Paid: 'bg-green-100 text-green-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const Orders = () => {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery()
  const placedOrderId = useLocation().state?.placedOrderId

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {placedOrderId && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Thank you! Order <strong>#{placedOrderId}</strong> has been placed.</span>
        </div>
      )}

      {isLoading && <p className="text-gray-500">Loading orders...</p>}
      {isError && <p className="text-red-500">Failed to load orders.</p>}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="rounded-lg border bg-white p-6 text-center">
          <p className="text-gray-600 mb-3">You haven't placed any orders yet.</p>
          <Link to="/" className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Start shopping
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg bg-white shadow-sm p-4">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <div>
                <p className="text-sm text-gray-500">Order ID: <span className="font-medium">#{order._id}</span></p>
                <p className="text-sm text-gray-500">Placed on: <span className="font-medium">{formatDate(order.createdAt)}</span></p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.variantId} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {item.weight}{item.weightType}{item.flavor ? ` · ${item.flavor}` : ''} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.subtotal.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-3 text-sm">
              <p className="text-gray-600">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'} · {order.address?.city}
              </p>
              <p className="font-semibold text-base">Total: ₹{order.totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
