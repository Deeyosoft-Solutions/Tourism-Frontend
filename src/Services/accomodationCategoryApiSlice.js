// src/services/accommodationApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./../Features/baseQuery";

export const accommodationCategoryApi = createApi({
  reducerPath: "accommodationCategoryApi",
  baseQuery,
  endpoints: (builder) => ({
    getAccomodationCategories: builder.query({
      query: () => "/accommodation-categories",
    }),
    addAccomodationCategory: builder.mutation({
      query: (body) => ({
        url: "/accommodation-categories",
        method: "POST",
        body,
      }),
    }),
    updateAccomodationCategory: builder.mutation({
      query: ({ slug, ...body }) => ({
        url: `/accommodation-categories/${slug}`,
        method: "PATCH", // or PUT if backend supports full replacement
        body,
      }),
    }),
    deleteAccomodationCategory: builder.mutation({
      query: (slug) => ({
        url: `/accommodation-categories/${slug}`, // use slug
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAccomodationCategoriesQuery,
  useAddAccomodationCategoryMutation,
  useUpdateAccomodationCategoryMutation,
  useDeleteAccomodationCategoryMutation,
} = accommodationCategoryApi;
