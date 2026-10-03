import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: () => `/account/all`,
      transformResponse: (response) => {
        if (!response || !response.data) {
          throw new Error("Invalid response format");
        }
        return response.data;
      },
      providesTags: ["Accounts"],
    }),
    setTransfer: builder.mutation({
      query: (data) => ({
        url: `/account/transfer`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const { useSetTransferMutation, useGetAccountQuery } = accountApi;

export default accountApi;
