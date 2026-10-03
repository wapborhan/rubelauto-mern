import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const leadApi = createApi({
  reducerPath: "leadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["Leads"],
  endpoints: (builder) => ({
    setLead: builder.mutation({
      query: (post) => ({
        url: `/lead`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Leads"],
    }),
    setUpdateLead: builder.mutation({
      query: ({ id, post }) => ({
        url: `/lead/${id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Leads"],
    }),
    setGuarantor: builder.mutation({
      query: ({ id, inputData }) => ({
        url: `/lead/addguarantor/${id}`,
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: ["Leads"],
    }),
    getLead: builder.query({
      query: () => `/lead`,
      providesTags: ["Leads"],
    }),
    getSingleLead: builder.query({
      query: (id) => `/lead/${id}`,
      providesTags: ["Leads"],
    }),
  }),
});

export const {
  useSetLeadMutation,
  useSetUpdateLeadMutation,
  useSetGuarantorMutation,
  useGetLeadQuery,
  useGetSingleLeadQuery,
} = leadApi;

export default leadApi;
