import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../Features/baseQuery";

export const travelPackageApi = createApi({
  reducerPath: "travelPackageApi",
  baseQuery,
  tagTypes: ["TravelPackage"],
  endpoints: (builder) => ({
    // Get all travel packages with optional filters
    getTravelPackages: builder.query({
      query: (params = {}) => {
        // Build query string from params
        const queryParams = new URLSearchParams();
        
        // Add all non-empty parameters
        Object.keys(params).forEach((key) => {
          if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
            queryParams.append(key, params[key]);
          }
        });
        
        const queryString = queryParams.toString();
        return `/travel-packages${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["TravelPackage"],
    }),

    // Get travel package by ID
    getTravelPackageById: builder.query({
      query: (id) => `/travel-packages/${id}`,
      providesTags: (result, error, id) => [{ type: "TravelPackage", id }],
    }),

    // Get travel package by slug
    getTravelPackageBySlug: builder.query({
      query: (slug) => `/travel-packages/${slug}`,
      providesTags: (result, error, slug) => [{ type: "TravelPackage", slug }],
    }),

    // Get travel packages by destinationId (relation)
    getTravelPackagesByDestinationId: builder.query({
      query: (destinationId) =>
        `/travel-packages?destinationId=${destinationId}`,
      providesTags: (result, error, destinationId) => [
        { type: "TravelPackage", destinationId },
      ],
    }),

    //Get travel packages by creatorId
    getTravelPackagesByCreatorId: builder.query({
      query: (creatorId) => `/travel-packages/by/${creatorId}`,
      providesTags: (result, error, creatorId) => [
        { type: "TravelPackage", creatorId },
      ],
    }),

    // Create a new travel package
    createTravelPackage: builder.mutation({
      query: (formData) => ({
        url: "/travel-packages",
        method: "POST",
        body: formData, // can be FormData (for images) or JSON
      }),
      invalidatesTags: ["TravelPackage"],
    }),

    // Update a travel package
    updateTravelPackage: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/travel-packages/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TravelPackage", id },
      ],
    }),

    // Delete a travel package by slug
    deleteTravelPackage: builder.mutation({
      query: (slug) => ({
        url: `/travel-packages/${slug}`, // use slug here
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "TravelPackage", id: slug },
      ],
    }),

    getTravelPackageMetrics: builder.query({
      query: () => "/travel-packages/dashboard/metrics",
      providesTags: ["TravelPackage"],
    }),
  }),
});

export const {
  useGetTravelPackagesQuery,
  useGetTravelPackageByIdQuery,
  useGetTravelPackageBySlugQuery,
  useGetTravelPackagesByDestinationIdQuery,
  useGetTravelPackagesByCreatorIdQuery,
  useGetTravelPackageMetricsQuery,
  useCreateTravelPackageMutation,
  useUpdateTravelPackageMutation,
  useDeleteTravelPackageMutation,
} = travelPackageApi;