import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from '../../pages/home/Home'
import { Error404 } from '../../layouts/Error404'

import RootLayout from '../../layouts/RootLayout'


// Pages shoppers usually open next; fetched in the background once the first page is idle
const loadProductDetail = () => import('../../features/products/pages/ProductDetail')
const loadCategoryPage = () => import('../../pages/category/pages/CategoryPage')
const loadSearchPage = () => import('../../pages/search/SearchPage')

const ProductDetail = lazy(loadProductDetail)
const CategoryPage = lazy(() => loadCategoryPage().then((m) => ({ default: m.CategoryPage })))
import AccountLayout from '../../features/account/components/AccountLayout'
const AccountOverview = lazy(() => import('../../features/account/pages/AccountOverview'))
const OrdersPage = lazy(() => import('../../features/account/pages/OrdersPage'))
const OrderDetailPage = lazy(() => import('../../features/account/pages/OrderDetailPage'))
const AddressesPage = lazy(() => import('../../features/account/pages/AddressesPage'))
const ProfilePage = lazy(() => import('../../features/account/pages/ProfilePage'))
const SettingsPage = lazy(() => import('../../features/account/pages/SettingsPage'))
import { PrivateRoute } from './PrivateRoute'
import CheckOutLayout from '../../layouts/CheckOutLayout'
const CheckOutPage = lazy(() => import('../../pages/checkOut/pages/CheckOutPage'))
const PolicesPage = lazy(() => import('../../features/policies/pages/PolicesPage'))
const TermsAndConditions = lazy(() => import('../../features/policies/pages/TermsAndConditions'))
const CancellationAndRefund = lazy(() => import('../../features/policies/pages/CancellationAndRefund'))
const ShippingAndDelivery = lazy(() => import('../../features/policies/pages/ShippingAndDelivery'))
const ContactUs = lazy(() => import('../../features/policies/pages/ContactUs'))
const SearchPage = lazy(loadSearchPage)
const NotFound = lazy(() => import('../../pages/NotFound'))

// Pages below are split into their own files and loaded on first visit
// (the service worker still precaches them all for offline use).
const Page = ({ children }) => (
  <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
    {children}
  </Suspense>
)

const prefetchPages = () => {
  const run = () => [loadProductDetail, loadCategoryPage, loadSearchPage].forEach((load) => load().catch(() => {}))
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 })
  else setTimeout(run, 1500)
}
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') prefetchPages()
  else window.addEventListener('load', prefetchPages, { once: true })
}

// Created once at load time (not on every render)
const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <Error404 />,
      children: [
        {
          path: "/",
          element: <Home />
        },

        {
          path: 'categories/:id',
          element: <Page><CategoryPage /></Page>
        },
        {
          path: 'product-detail/:id',
          element: <Page><ProductDetail /></Page>
        },
        {
          path: 'policies',
          element: <Page><PolicesPage /></Page>,
          children: [
            { index: true, element: <Navigate to="terms" replace /> },
            { path: 'terms', element: <Page><TermsAndConditions /></Page> },
            { path: 'cancellation-refund', element: <Page><CancellationAndRefund /></Page> },
            { path: 'shipping-delivery', element: <Page><ShippingAndDelivery /></Page> },
            { path: 'contact-us', element: <Page><ContactUs /></Page> },
          ],
        },
        {
          path: 'search',
          element: <Page><SearchPage /></Page>
        },
        {
          path: '*',
          element: <Page><NotFound /></Page>
        }

      ],
    },
    {
      path: '/account',
      element: <PrivateRoute />,
      errorElement: <Error404 />,
      children: [
        {
          element: <AccountLayout />,
          children: [
            { index: true, element: <Page><AccountOverview /></Page> },
            { path: 'orders', element: <Page><OrdersPage /></Page> },
            { path: 'orders/:orderId', element: <Page><OrderDetailPage /></Page> },
            { path: 'addresses', element: <Page><AddressesPage /></Page> },
            { path: 'profile', element: <Page><ProfilePage /></Page> },
            { path: 'settings', element: <Page><SettingsPage /></Page> },
          ],
        },
      ],
    },
    // Old /profile links (bookmarks, installed-app shortcuts) keep working
    { path: '/profile', element: <Navigate to="/account" replace /> },
    { path: '/profile/orders', element: <Navigate to="/account/orders" replace /> },
    { path: '/profile/addresses', element: <Navigate to="/account/addresses" replace /> },
    // {
    //   path: '/checkout',
    //   element: <CheckOutLayout />,
    //   children: [
    //     {
    //       path: '',
    //       element: <CheckOutPage />
    //     }
    //   ]
    // }
    {
      path: '/checkout',
      element: <PrivateRoute />,      // ✅ protect the route here
      children: [
        {
          element: <CheckOutLayout />,
          children: [
            {
              path: '',
              element: <Page><CheckOutPage /></Page>
            }
          ]
        }
      ]
    },



])

const AppRoutes = () => <RouterProvider router={appRouter} />

export default AppRoutes