// src/services/accommodationApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../Features/baseQuery';

export const accommodationCategoryApi = createApi({
  reducerPath: 'accommodationApi',
  baseQuery,
  endpoints: (builder) => ({
    getAccomodationCategories: builder.query({
      query: () => '/accommodation-categories',
    }),
    addAccomodationCategory: builder.mutation({
      query: (body) => ({
        url: '/accommodation-categories',
        method: 'POST',
        body,
      }),
    }),
    deleteAccomodationCategory: builder.mutation({
      query: (id) => ({
        url: `/accommodation-categories/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetAccomodationCategoriesQuery, useAddAccomodationCategoryMutation, useDeleteAccomodationCategoryMutation } = accommodationCategoryApi;
