import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["Purchase"],
  endpoints: (builder) => ({
    setPurchase: builder.mutation({
      query: (post) => ({
        url: `/stock`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Purchase"],
    }),
    setpartsPurchase: builder.mutation({
      query: (post) => ({
        url: `/parts`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Purchase"],
    }),
    getPurchase: builder.query({
      query: () => `/stock`,
      providesTags: ["Purchase"],
    }),
    getPartsPurchase: builder.query({
      query: () => `/parts`,
      providesTags: ["Purchase"],
    }),
  }),
});

export const {
  useSetPurchaseMutation,
  useGetPartsPurchaseQuery,
  useSetpartsPurchaseMutation,
  useGetPurchaseQuery,
} = purchaseApi;

export default purchaseApi;
