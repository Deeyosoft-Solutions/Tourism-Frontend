import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./../Features/baseQuery";

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery,
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    // ✅ Get all rooms for a specific accommodation
    getRooms: builder.query({
      query: (slug) => `/accommodations/${slug}/rooms`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Rooms", id })),
              { type: "Rooms", id: "LIST" },
            ]
          : [{ type: "Rooms", id: "LIST" }],
    }),

    // ✅ Create a new room
    createRoom: builder.mutation({
      query: (body) => ({
        url: `/rooms`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Rooms", id: "LIST" }],
    }),

    // ✅ Update an existing room
    updateRoom: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/rooms/${id}`,
        method: "PATCH",
        body: patch, // <- now the object { status: "inactive" } is sent correctly
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Rooms", id },
        { type: "Rooms", id: "LIST" },
      ],
    }),

    // ✅ Publish / Unpublish room
    publishRoom: builder.mutation({
      query: ({ id, published }) => ({
        url: `/rooms/${id}/publish`,
        method: "PATCH", // or POST (depends on backend)
        body: { published }, // boolean
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Rooms", id },
        { type: "Rooms", id: "LIST" },
      ],
    }),

    // ✅ Delete a room
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Rooms", id },
        { type: "Rooms", id: "LIST" },
      ],
    }),
    // Update booking status
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/room-booking/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RoomBookings", id },
        { type: "RoomBookings", id: "LIST" },
      ],
    }),

    // Cancel booking
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/room-booking/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "RoomBookings", id },
        { type: "RoomBookings", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  usePublishRoomMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useDeleteRoomMutation,
} = roomsApi;
