import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    setCustomer: builder.mutation({
      query: ({ leadsId, status, data }) => ({
        url: `/customer?leadId=${leadsId}&status=${status}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    setInstallment: builder.mutation({
      query: (data) => ({
        url: `/installment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    setPaidCustomer: builder.mutation({
      query: ({ cardNo, data }) => ({
        url: `/customer/paid/${cardNo}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    setSeizedCustomer: builder.mutation({
      query: ({ cardNo, data }) => ({
        url: `/customer/seized/${cardNo}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    setSeizedBack: builder.mutation({
      query: ({ cardno, backData }) => ({
        url: `/customer/seized/${cardno}`,
        method: "PATCH",
        body: backData,
      }),
      invalidatesTags: ["Customer"],
    }),

    setUpdateDocument: builder.mutation({
      query: ({ card, backData }) => ({
        url: `/document/update/${card}`,
        method: "PATCH",
        body: backData,
      }),
      invalidatesTags: ["Customer"],
    }),

    getCustomer: builder.query({
      query: ({ path, showRoom }) =>
        `/customer/all/${path}?showroom=${showRoom}`,
      providesTags: ["Customer"],
    }),

    getSingleCustomer: builder.query({
      query: (cardNo) => `/customer/${cardNo}`,
      providesTags: ["Customer"],
    }),

    getSingleInstallment: builder.query({
      query: (cardNo) => `/installment/${cardNo}`,
      providesTags: ["Customer"],
    }),
  }),
});

export const {
  useSetCustomerMutation,
  useGetCustomerQuery,
  useSetInstallmentMutation,
  useSetUpdateDocumentMutation,
  useSetSeizedBackMutation,
  useSetSeizedCustomerMutation,
  useSetPaidCustomerMutation,
  useGetSingleCustomerQuery,
  useGetSingleInstallmentQuery,
} = customerApi;

export default customerApi;
