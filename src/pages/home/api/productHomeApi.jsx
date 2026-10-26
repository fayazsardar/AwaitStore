import { apiSlice } from "../../../app/api/apiSlice";



export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeaturedProducts: builder.query({
      query: () => "nutrify/home/",
      providesTags: ["Products",'AwaitStore'],
      refetchOnFocus: true,
    }),
    getSubCategories: builder.query({
      query: () => "nutrify/categories/top/",
      providesTags: ["Categories",'AwaitStore'],
      refetchOnFocus: true,
    }),
  }),
});

export const {
  useGetFeaturedProductsQuery,
  useGetSubCategoriesQuery,
} = productApi;