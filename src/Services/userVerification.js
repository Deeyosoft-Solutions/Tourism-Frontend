// src/Services/verificationApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../Features/baseQuery";

export const verificationApi = createApi({
  reducerPath: "verificationApi",
  baseQuery,
  endpoints: (builder) => ({
    getPendingVerificationUsers: builder.query({
      query: () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: "/user/admin/pending-verification",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    getVerificationRequirementsByRole: builder.query({
      query: (role) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: `/user/verification-requirements/${role}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    uploadVerificationDocuments: builder.mutation({
      query: (body) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: "/user/verification-documents",
          method: "PATCH",
          body,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    updateVerificationStatus: builder.mutation({
      query: ({ id, status, rejectionReason }) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: `/user/${id}/verification-status`,
          method: "PATCH",
          body: {
            status,
            rejectionReason,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    verifyUserAccount: builder.mutation({
      query: (id) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: `/user/${id}/verify`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    unverifyUserAccount: builder.mutation({
      query: (id) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token is required");

        return {
          url: `/user/${id}/unverify`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),
  }),
});

export const {
  useGetPendingVerificationUsersQuery,
  useGetVerificationRequirementsByRoleQuery,
  useUploadVerificationDocumentsMutation,
  useUpdateVerificationStatusMutation,
  useVerifyUserAccountMutation,
  useUnverifyUserAccountMutation,
} = verificationApi;
