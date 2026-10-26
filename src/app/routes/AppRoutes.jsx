import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../../pages/home/Home'
import { Error404 } from '../../layouts/Error404'

import RootLayout from '../../layouts/RootLayout'


const ProductDetail = lazy(() => import('../../features/products/pages/ProductDetail'))
const CategoryPage = lazy(() => import('../../pages/category/pages/CategoryPage').then((m) => ({ default: m.CategoryPage })))
import ProfileLayout from '../../layouts/ProfileLayout'
const ProfileOverview = lazy(() => import('../../features/profile/pages/ProfileOverview'))
const Addresses = lazy(() => import('../../features/profile/pages/Addresses'))
const Orders = lazy(() => import('../../features/profile/pages/Orders'))
import { PrivateRoute } from './PrivateRoute'
import CheckOutLayout from '../../layouts/CheckOutLayout'
const CheckOutPage = lazy(() => import('../../pages/checkOut/pages/CheckOutPage'))
const PolicesPage = lazy(() => import('../../features/policies/pages/PolicesPage'))
const TermsAndConditions = lazy(() => import('../../features/policies/pages/TermsAndConditions'))
const CancellationAndRefund = lazy(() => import('../../features/policies/pages/CancellationAndRefund'))
const ShippingAndDelivery = lazy(() => import('../../features/policies/pages/ShippingAndDelivery'))
const ContactUs = lazy(() => import('../../features/policies/pages/ContactUs'))
const SearchPage = lazy(() => import('../../pages/search/SearchPage'))

// Pages below are split into their own files and loaded on first visit
// (the service worker still precaches them all for offline use).
const Page = ({ children }) => (
  <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading…</div>}>
    {children}
  </Suspense>
)

const AppRoutes = () => {



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
          path: 'search',
          element: <Page><SearchPage /></Page>
        }

      ],
    },
    {
      path: '/profile',
      element: <PrivateRoute />,
      children: [
        {
          element: <ProfileLayout />,
          children: [
            {
              path: '',
              element: <Page><ProfileOverview /></Page>,

            },
            {
              path: 'addresses',
              element: <Page><Addresses /></Page>
            },
            {
              path: 'orders',
              element: <Page><Orders /></Page>
            }
          ]
        }

      ]

    },
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

    {
      path:'/policies',
      element:<Page><PolicesPage /></Page>,
       children: [
    { path: 'terms', element: <Page><TermsAndConditions /></Page> },
    { path: 'cancellation-refund', element: <Page><CancellationAndRefund /></Page> },
    { path: 'shipping-delivery', element: <Page><ShippingAndDelivery /></Page> },
    { path: 'contact-us', element: <Page><ContactUs /></Page> },
  ],
    }


  ]
  )




  return (
    <RouterProvider router={appRouter} />
  )
}

export default AppRoutes