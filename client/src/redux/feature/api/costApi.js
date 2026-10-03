import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const costApi = createApi({
  reducerPath: "costApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  endpoints: (builder) => ({
    setCost: builder.mutation({
      query: (post) => ({
        url: `/cost`,
        method: "POST",
        body: post,
      }),
    }),
    getCost: builder.query({
      query: (showRoom) => `/cost?showroom=${showRoom}`,
    }),
  }),
});
export const { useGetCostQuery, useSetCostMutation } = costApi;

export default costApi;
