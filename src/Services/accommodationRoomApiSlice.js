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
      providesTags: (result, error, slug) =>
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
      query: ({ id, body }) => ({
        url: `/rooms/${id}`,
        method: "PATCH",
        body,
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
  }),
});

export const {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;
