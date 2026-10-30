
import privateApiSlice from "../../../app/api/privateApiSlice";


export const orderApi=privateApiSlice.injectEndpoints({
    endpoints:(build)=>({
        initiateOrder:build.query({
            query:()=>'order/initiate',
            providesTags: ['Order'],
        }),
        placeOrder:build.mutation({
            query:(body)=>({
                url:'order',
                method:'POST',
                body,
            }),
            invalidatesTags: ['Cart', 'Order', { type: 'Orders', id: 'LIST' }],
        })
    })
})

export const { useInitiateOrderQuery, usePlaceOrderMutation } = orderApi;