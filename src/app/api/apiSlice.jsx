
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import mockBaseQuery, { USE_MOCK_API } from "./mockBaseQuery";



export const apiSlice=createApi({
    reducerPath:"api",
    baseQuery:USE_MOCK_API ? mockBaseQuery : fetchBaseQuery({ baseUrl:`${import.meta.env.VITE_DATABASE_API_URL}/api/`}),
    tagTypes:['AwaitStore'],
    refetchOnFocus:true,
    refetchOnReconnect:true,
    endpoints:()=>({}),
})