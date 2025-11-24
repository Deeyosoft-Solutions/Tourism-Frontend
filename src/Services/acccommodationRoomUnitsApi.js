import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../Features/baseQuery"; // your existing baseQuery setup

export const roomUnitsApi = createApi({
  reducerPath: "roomUnitsApi",
  baseQuery,
  tagTypes: ["RoomUnits"],
  endpoints: (builder) => ({
    // 🔹 Get all units for a specific room
    getRoomUnits: builder.query({
      query: (roomId) => `/rooms/${roomId}/units`,
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map((item) => ({ type: "RoomUnits", id: item.id })),
              { type: "RoomUnits", id: "LIST" },
            ]
          : [{ type: "RoomUnits", id: "LIST" }],
    }),

    // 🔹 Create a new room unit
    createRoomUnit: builder.mutation({
      query: ({ roomId, ...body }) => ({
        url: `/rooms/${roomId}/units`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "RoomUnits", id: "LIST" }],
    }),

    // 🔹 Update a specific room unit
    updateRoomUnit: builder.mutation({
      query: ({ roomId, unitId, ...body }) => ({
        url: `/rooms/${roomId}/units/${unitId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { unitId }) => [
        { type: "RoomUnits", id: unitId },
        { type: "RoomUnits", id: "LIST" },
      ],
    }),

    // 🔹 Delete a specific room unit
    deleteRoomUnit: builder.mutation({
      query: ({ roomId, unitId }) => ({
        url: `/rooms/${roomId}/units/${unitId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { unitId }) => [
        { type: "RoomUnits", id: unitId },
        { type: "RoomUnits", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRoomUnitsQuery,
  useCreateRoomUnitMutation,
  useUpdateRoomUnitMutation,
  useDeleteRoomUnitMutation,
} = roomUnitsApi;
