// userApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../Features/slice/authSlice";
import { baseQuery } from "../Features/baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  endpoints: (builder) => ({
    fetchUserProfile: builder.query({
      query: () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: "/user/profile",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user }));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, role, sort, search }) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        const params = new URLSearchParams({
          page,
          limit,
        });

        // Only append role if a single role is selected
        if (role) {
          params.append("role", role);
        }

        if (sort) params.append("sort", sort);
        if (search) params.append("search", search);

        return {
          url: `/user?${params.toString()}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    updateUserById: builder.mutation({
      query: ({ id, body }) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: `/user/${id}`,
          method: "PATCH",
          body, // data to update (role, status, name, etc.)
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    getUserBookings: builder.query({
      async queryFn(userId, _queryApi, _extraOptions, baseFetch) {
        try {
          const accessToken = await localStorage.getItem("accessToken");
          if (!accessToken) throw new Error("Access token is required");

          const result = await baseFetch({
            url: `/user/${userId}/bookings`,
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (result.error) throw result.error;
          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      transformResponse: (response) => response.data,
      providesTags: (result, error, userId) => [
        { type: "User", id: `${userId}-bookings` },
      ],
    }),

    getUserById: builder.query({
      query: (userId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: `/user/${userId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),
  }),
});

export const {
  useFetchUserProfileQuery,
  useGetUserByIdQuery,
  useGetUserBookingsQuery,
  useGetAllUsersQuery,
  useUpdateUserByIdMutation,
} = userApi;
