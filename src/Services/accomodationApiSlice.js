// src/services/accommodationApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './../Features/baseQuery';

export const accommodationApi = createApi({
  reducerPath: 'accommodationApi',
  baseQuery,
  endpoints: (builder) => ({
    getAccommodations: builder.query({
      query: () => '/accommodations',
    }),
    addAccommodation: builder.mutation({
      query: (formData) => ({
        url: '/accommodations',
        method: 'POST',
        body: formData,
      }),
    }),
    deleteAccommodation: builder.mutation({
      query: (id) => ({
        url: `/accommodations/${id}`,
        method: 'DELETE',
      }),
    }),
    updateAccommodation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/accommodations/${id}`,
        method: 'PATCH', // or PUT depending on your API
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAccommodationsQuery,
  useAddAccommodationMutation,
  useDeleteAccommodationMutation,
  useUpdateAccommodationMutation,
} = accommodationApi;
