import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
    setSupplier: builder.mutation({
      query: (post) => ({
        url: `/supplier`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Supplier"],
    }),
    getSupplier: builder.query({
      query: () => `/supplier`,
      providesTags: ["Supplier"],
    }),
    getSingleSupplier: builder.query({
      query: (id) => `/supplier/${id}`,
      providesTags: ["Supplier"],
    }),
    setUpdateSupplier: builder.mutation({
      query: ({ id, inputData }) => ({
        url: `/supplier/${id}`,
        method: "PATCH",
        body: inputData,
      }),
      invalidatesTags: ["Supplier"],
    }),
    getSupplierStatement: builder.query({
      query: (id) => `supplier/${id}/statement`,
      providesTags: ["Supplier"],
    }),
    setSupplierPayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/supplier/payment/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useSetSupplierMutation,
  useSetUpdateSupplierMutation,
  useGetSupplierQuery,
  useGetSingleSupplierQuery,
  useGetSupplierStatementQuery,
  useSetSupplierPaymentMutation,
} = supplierApi;

export default supplierApi;
