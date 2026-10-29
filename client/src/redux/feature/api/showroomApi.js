import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const showroomApi = createApi({
  reducerPath: "showroomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["Showroom"],
  endpoints: (builder) => ({
    setShowroom: builder.mutation({
      query: (post) => ({
        url: `/showroom`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Showroom"],
    }),
    getShowroom: builder.query({
      query: () => `/showroom`,
      transformResponse: (response) => {
        if (!response || !response.data) {
          return [];
        }
        return response.data;
      },
      providesTags: ["Showroom"],
    }),
  }),
});

export const { useSetShowroomMutation, useGetShowroomQuery } = showroomApi;

export default showroomApi;
