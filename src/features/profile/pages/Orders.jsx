import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useGetOrdersQuery } from '../../../pages/checkOut/api/orderApi'
import { formatPrice } from '../../../utils/format'
import useDocumentTitle from '../../../utils/useDocumentTitle'

const STATUS_STYLES = {
  Paid: 'bg-green-100 text-green-700',
  Confirmed: 'bg-brand-50 text-brand-800',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const Orders = () => {
  useDocumentTitle('My orders')
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery()
  const placedOrderId = useLocation().state?.placedOrderId

  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold tracking-tight">My orders</h1>

      {placedOrderId && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Thank you! Order <strong>#{placedOrderId}</strong> has been placed.</span>
        </div>
      )}

      {isLoading && <div className="space-y-4"><div className="skeleton h-48 rounded-2xl" /><div className="skeleton h-48 rounded-2xl" /></div>}
      {isError && <p className="text-red-500">Failed to load orders.</p>}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-600 mb-3">You haven't placed any orders yet.</p>
          <Link to="/" className="inline-block rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
            Start shopping
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-card">
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
                  <img src={item.image} alt={item.productName} className="h-16 w-16 rounded-xl bg-gray-50 object-contain p-1" loading="lazy" />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {item.weight}{item.weightType}{item.flavor ? ` · ${item.flavor}` : ''} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-3 text-sm">
              <p className="text-gray-600">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'} · {order.address?.city}
              </p>
              <p className="font-semibold text-base">Total: {formatPrice(order.totalAmount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
