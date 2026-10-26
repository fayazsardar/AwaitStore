import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import mockBaseQuery, { USE_MOCK_API } from "./mockBaseQuery";

const privateApiSlice = createApi({
  reducerPath: "privateApi", 
  baseQuery: USE_MOCK_API ? mockBaseQuery : fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_DATABASE_API_URL}/api/user/`,
    credentials: "include", 
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Address", "Orders", "Order", "Cart"],
  endpoints: () => ({}),
});

export default privateApiSlice;
