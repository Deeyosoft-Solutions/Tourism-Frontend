import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../Features/baseQuery';

export const accommodationBookingApi = createApi({
  reducerPath: "accommodationBookingApi",
  baseQuery,
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => "/booking",
    }),
  }),
});

export const { useGetBookingsQuery } = accommodationBookingApi;
