import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../Features/baseQuery';

export const roomBookingApi = createApi({
  reducerPath: "roomBookingApi",
  baseQuery,
  tagTypes: ["RoomBooking", "RoomAvailability"],
  endpoints: (builder) => ({
    // GET /api/v1/room-booking/rooms/{roomId}/availability
    getRoomAvailability: builder.query({
      query: ({ roomId, startDate, endDate }) => 
        `/room-booking/rooms/${roomId}/availability?startDate=${startDate}&endDate=${endDate}`,
      providesTags: (result, error, { roomId }) => [
        { type: "RoomAvailability", id: roomId },
      ],
    }),

    // GET /api/v1/room-booking
    getRoomBookings: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/room-booking${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "RoomBooking", id })),
              { type: "RoomBooking", id: "LIST" },
            ]
          : [{ type: "RoomBooking", id: "LIST" }],
    }),

    // GET /api/v1/room-booking?accommodationId={accommodationId}
    getBookingsByAccommodationId: builder.query({
      query: (accommodationId) => `/room-booking?accommodationId=${accommodationId}`,
      providesTags: (result, error, accommodationId) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "RoomBooking", id })),
              { type: "RoomBooking", id: `ACCOMMODATION-${accommodationId}` },
            ]
          : [{ type: "RoomBooking", id: `ACCOMMODATION-${accommodationId}` }],
    }),

    // POST /api/v1/room-booking
    createRoomBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/room-booking",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: [
        { type: "RoomBooking", id: "LIST" },
        { type: "RoomAvailability" },
      ],
    }),

    // PATCH /api/v1/room-booking/{id}/cancel
    cancelRoomBooking: builder.mutation({
      query: ({ id, ...cancelData }) => ({
        url: `/room-booking/${id}/cancel`,
        method: "PATCH",
        body: cancelData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RoomBooking", id },
        { type: "RoomBooking", id: "LIST" },
        { type: "RoomAvailability" },
      ],
    }),

    // PATCH /api/v1/room-booking/{id}/status
    updateRoomBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/room-booking/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RoomBooking", id },
        { type: "RoomBooking", id: "LIST" },
        { type: "RoomAvailability" },
      ],
    }),
  }),
});

export const {
  useGetRoomAvailabilityQuery,
  useGetRoomBookingsQuery,
  useGetBookingsByAccommodationIdQuery,
  useCreateRoomBookingMutation,
  useCancelRoomBookingMutation,
  useUpdateRoomBookingStatusMutation,
} = roomBookingApi;