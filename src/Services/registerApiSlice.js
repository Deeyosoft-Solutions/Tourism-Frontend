// features/auth/authApiSlice.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./../Features/baseQuery";

export const registerApiSlice = createApi({
  reducerPath: "registerApi",
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    checkEmail: builder.query({
      query: (email) => ({
        url: `/Auth/check-email?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLazyCheckEmailQuery } = registerApiSlice;