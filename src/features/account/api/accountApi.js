import privateApiSlice from "../../../app/api/privateApiSlice";

// Everything behind "My account": profile, preferences, orders and saved addresses.
// All endpoints need a logged-in user (privateApiSlice adds the bearer token).
export const accountApi = privateApiSlice.injectEndpoints({
  endpoints: (build) => ({
    // ---- Profile ----
    getProfile: build.query({
      query: () => "profile",
      transformResponse: (response) => response.user,
      providesTags: ["Profile"],
    }),
    updateProfile: build.mutation({
      query: (body) => ({ url: "profile", method: "PATCH", body }),
      invalidatesTags: ["Profile"],
    }),
    deleteAccount: build.mutation({
      query: () => ({ url: "account", method: "DELETE" }),
    }),

    // ---- Preferences ----
    getPreferences: build.query({
      query: () => "preferences",
      transformResponse: (response) => response.preferences,
      providesTags: ["Preferences"],
    }),
    updatePreferences: build.mutation({
      query: (body) => ({ url: "preferences", method: "PATCH", body }),
      // Optimistic: flip the toggle immediately, roll back if the request fails
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const undo = dispatch(
          accountApi.util.updateQueryData("getPreferences", undefined, (draft) => Object.assign(draft, patch))
        );
        try {
          await queryFulfilled;
        } catch {
          undo.undo();
        }
      },
    }),

    // ---- Orders ----
    getOrders: build.query({
      query: () => "order",
      transformResponse: (response) => response.orders,
      providesTags: (orders = []) => [
        { type: "Orders", id: "LIST" },
        ...orders.map((o) => ({ type: "Orders", id: o._id })),
      ],
    }),
    getOrder: build.query({
      query: (orderId) => `order/${orderId}`,
      transformResponse: (response) => response.order,
      providesTags: (_order, _err, orderId) => [{ type: "Orders", id: orderId }],
    }),
    cancelOrder: build.mutation({
      query: ({ orderId, reason }) => ({ url: `order/${orderId}/cancel`, method: "PATCH", body: { reason } }),
      invalidatesTags: (_res, _err, { orderId }) => [
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // ---- Addresses ----
    getAddresses: build.query({
      query: () => "address",
      transformResponse: (response) => response.address,
      providesTags: ["Addresses"],
    }),
    addAddress: build.mutation({
      query: (body) => ({ url: "address", method: "POST", body }),
      invalidatesTags: ["Addresses"],
    }),
    updateAddress: build.mutation({
      query: ({ id, ...body }) => ({ url: `address/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Addresses"],
    }),
    setDefaultAddress: build.mutation({
      query: (id) => ({ url: `address/${id}/default`, method: "PATCH" }),
      invalidatesTags: ["Addresses"],
    }),
    deleteAddress: build.mutation({
      query: (id) => ({ url: `address/${id}`, method: "DELETE" }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = accountApi;
