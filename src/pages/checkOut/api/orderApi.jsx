
import privateApiSlice from "../../../app/api/privateApiSlice";


export const orderApi=privateApiSlice.injectEndpoints({
    endpoints:(build)=>({
        initiateOrder:build.query({
            query:()=>'order/initiate',
            providesTags: ['Order'],
        }),
        getOrders:build.query({
            query:()=>'order',
            providesTags: ['Orders'],
            transformResponse: (response) => response.orders,
        }),
        placeOrder:build.mutation({
            query:(body)=>({
                url:'order',
                method:'POST',
                body,
            }),
            invalidatesTags: ['Cart', 'Order', 'Orders'],
        })
    })
})

export const { useInitiateOrderQuery, useGetOrdersQuery, usePlaceOrderMutation } = orderApi;