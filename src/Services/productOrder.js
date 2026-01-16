// src/Services/productOrderApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../Features/baseQuery";

export const productOrderApi = createApi({
  reducerPath: "productOrderApi",
  baseQuery: baseQuery, // Use your existing baseQuery configuration
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Create a new order
    createOrder: builder.mutation({
      query: (formData) => ({
        url: "/orders",
        method: "POST",
        body: formData,
        // FormData is automatically handled, no need to set Content-Type
      }),
      invalidatesTags: ["Order"],
    }),

    // Get all orders (optional - if you need to fetch orders)
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),

    // Get a single order by ID (optional)
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
    }),

    // Update order status (optional - if needed)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        "Order",
      ],
    }),

    // Cancel order (optional - if needed)
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
        "Order",
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = productOrderApi;