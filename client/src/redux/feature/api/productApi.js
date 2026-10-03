import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    setproduct: builder.mutation({
      query: (post) => ({
        url: `/product`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Product"],
    }),
    setUpdateProduct: builder.mutation({
      query: ({ id, inputData }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body: inputData,
      }),
      invalidatesTags: ["Product"],
    }),
    setDeleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getproduct: builder.query({
      query: () => `/product`,
      providesTags: ["Product"],
    }),
    getSingleProduct: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useSetproductMutation,
  useSetUpdateProductMutation,
  useSetDeleteProductMutation,
  useGetproductQuery,
  useGetSingleProductQuery,
} = productApi;

export default productApi;
