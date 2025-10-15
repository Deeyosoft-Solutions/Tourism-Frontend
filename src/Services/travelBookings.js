// Services/travelBookingsApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../Features/baseQuery';

export const travelBookingsApi = createApi({
  reducerPath: "travelBookingsApi",
  baseQuery,
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => "/bookings",
    }),
  }),
});

export const { useGetBookingsQuery } = travelBookingsApi;
