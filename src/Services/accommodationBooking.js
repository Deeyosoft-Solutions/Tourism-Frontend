import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../Features/baseQuery';

export const accommodationBookingApi = createApi({
  reducerPath: "accommodationBookingApi",
  baseQuery,
  endpoints: (builder) => ({
    getAccommodationBookings: builder.query({
      query: () => "/booking",
    }),
    getBookingsByAccommodationId: builder.query({
      query: (accommodationId) => `/booking/accommodation/${accommodationId}`,
    }),
  }),
});

export const { 
  useGetAccommodationBookingsQuery,
  useGetBookingsByAccommodationIdQuery 
} = accommodationBookingApi;