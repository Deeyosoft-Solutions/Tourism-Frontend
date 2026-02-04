// Services/travelBookingsApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../Features/baseQuery';

export const travelBookingsApi = createApi({
  reducerPath: "travelBookingsApi",
  baseQuery,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    // Create travel package booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),

    // Get my bookings
    getTravelBookings: builder.query({
      query: () => "/bookings",
      providesTags: ['Booking'],
    }),

    // Get bookings for my packages (owner/admin)
    getAgencyBookings: builder.query({
      query: () => "/bookings/agency",
      providesTags: ['Booking'],
    }),

    // Get single booking (booker/owner/admin)
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // Update additional travellers (booker/owner/admin)
    updateBookingTravellers: builder.mutation({
      query: ({ id, travellers }) => ({
        url: `/bookings/${id}/travellers`,
        method: "PATCH",
        body: travellers,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
    }),

    // Update booking status
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PATCH",
        body: status,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetTravelBookingsQuery,
  useGetAgencyBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingTravellersMutation,
  useUpdateBookingStatusMutation,
} = travelBookingsApi;