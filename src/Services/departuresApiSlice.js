// services/departuresApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './../Features/baseQuery';

export const departuresApi = createApi({
  reducerPath: 'departuresApi',
  baseQuery,
  tagTypes: ['Departures'],
  endpoints: (builder) => ({
    // GET all departures for a package
    getDepartures: builder.query({
      query: (slug) => `travel-packages/${slug}/departures`,
      providesTags: ['Departures'],
    }),

    // CREATE a new departure for a package
    createDeparture: builder.mutation({
      query: ({ slug, data }) => ({
        url: `travel-packages/${slug}/departures`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Departures'],
    }),

    // CREATE bulk departures for a package
    createBulkDepartures: builder.mutation({
      query: ({ slug, data }) => ({
        url: `travel-packages/${slug}/departures/bulk`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Departures'],
    }),

    // UPDATE an existing departure
    updateDeparture: builder.mutation({
      query: ({ slug, id, data }) => ({
        url: `travel-packages/${slug}/departures/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Departures'],
    }),

    // DELETE a departure
    deleteDeparture: builder.mutation({
      query: ({ slug, id }) => ({
        url: `travel-packages/${slug}/departures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departures'],
    }),
  }),
});

export const {
  useGetDeparturesQuery,
  useCreateDepartureMutation,
  useCreateBulkDeparturesMutation,
  useUpdateDepartureMutation,
  useDeleteDepartureMutation,
} = departuresApi;