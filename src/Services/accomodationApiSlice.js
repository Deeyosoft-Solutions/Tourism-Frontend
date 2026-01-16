// src/services/accommodationApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './../Features/baseQuery';

export const accommodationApi = createApi({
  reducerPath: 'accommodationApi',
  baseQuery,
  tagTypes: ['Accommodation'],
  endpoints: (builder) => ({
    getAccommodations: builder.query({
      query: () => '/accommodations',
      providesTags: ['Accommodation'],
    }),
     getAccommodationsByHost: builder.query({
      query: (hostId) => `/accommodations?hostId=${hostId}`,
      providesTags: ['Accommodation'],
    }),
     getAccommodationBySlug: builder.query({
      query: (slug) => `/accommodations/${slug}`,
      providesTags: ['Accommodation'],
    }),

    addAccommodation: builder.mutation({
      query: (formData) => ({
        url: '/accommodations',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Accommodation'],
    }),
    deleteAccommodation: builder.mutation({
      query: (id) => ({
        url: `/accommodations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Accommodation'],
    }),
    updateAccommodation: builder.mutation({
      query: ({ slug, ...data }) => ({
        url: `/accommodations/${slug}`,
        method: 'PATCH', // or PUT depending on your API
        body: data,
      }),
      invalidatesTags: ['Accommodation'],
    }),
  }),
});

export const {
  useGetAccommodationsQuery,
  useGetAccommodationsByHostQuery,
  useGetAccommodationBySlugQuery,
  useAddAccommodationMutation,
  useDeleteAccommodationMutation,
  useUpdateAccommodationMutation,
} = accommodationApi;
