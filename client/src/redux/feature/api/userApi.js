import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    setUser: builder.mutation({
      query: (data) => ({
        url: `/user`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => `/user/all`,
      providesTags: ["User"],
    }),
    getUserByEmail: builder.query({
      query: (email) => `/user?email=${email}`,
      providesTags: (result, error, email) => [{ type: "User", id: email }],
    }),
    setUpdateUser: builder.mutation({
      query: ({ email, userInfo }) => ({
        url: `/user?email=${email}`,
        method: "PATCH",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSetUserMutation,
  useGetUsersQuery,
  useGetUserByEmailQuery,
  useSetUpdateUserMutation,
} = userApi;

export default userApi;
