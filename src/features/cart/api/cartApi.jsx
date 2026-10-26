import privateApiSlice from "../../../app/api/privateApiSlice";


export const cartApi = privateApiSlice.injectEndpoints({
    endpoints: (build) => ({
        getCart: build.query({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),

        addItemToCart: build.mutation({
            query: (body) => ({
                url: '/cart',
                method: "POST",
                body
            }),
            invalidatesTags: ["Cart"],
        }),

        removeItemFromCart: build.mutation({
            query: (variantId) => ({
                url: `/cart/${variantId}`,
                method: "DELETE",

            }),
            invalidatesTags: ["Cart"],
        }),
        updateCartItem: build.mutation({
            query: ({ variantId, quantity }) => ({
                url: `/cart/${variantId}`,
                method: "PATCH",
                body: { quantity },
            }),
            invalidatesTags: ["Cart"],
        }),
        clearUserCart: build.mutation({
            query: () => ({
                url: `/cart/clear`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
        syncGuestCart: build.mutation({
            query: (items) => ({
                url: `/cart/sync`,
                method: "POST",
                body: { items },
            }),
            invalidatesTags: ["Cart"],
        }),


    })
})


export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useRemoveItemFromCartMutation,
  useUpdateCartItemMutation,
  useClearUserCartMutation,
  useSyncGuestCartMutation,
} = cartApi;