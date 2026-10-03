import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const incomeApi = createApi({
  reducerPath: "incomeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  endpoints: (builder) => ({
    setIncome: builder.mutation({
      query: (post) => ({
        url: `/income`,
        method: "POST",
        body: post,
      }),
    }),
    getIncome: builder.query({
      query: (showRoom) => `/income?showroom=${showRoom}`,
    }),
  }),
});

export const { useGetIncomeQuery, useSetIncomeMutation } = incomeApi;

export default incomeApi;
