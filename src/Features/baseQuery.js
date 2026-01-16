import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://tourism.smartptrm.com/api/v1",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // 🔴 Access token expired
  if (result?.error?.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    // ❌ No refresh token → force logout
    if (!refreshToken) {
      forceLogout();
      return result;
    }

    // 🔁 Try refreshing access token
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.accessToken) {
      // ✅ Save new tokens
      localStorage.setItem(
        "accessToken",
        refreshResult.data.accessToken
      );

      if (refreshResult.data.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          refreshResult.data.refreshToken
        );
      }

      // 🔁 Retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // ❌ Refresh failed
      forceLogout();
    }
  }

  return result;
};

const forceLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  window.location.href = "/login";
};
