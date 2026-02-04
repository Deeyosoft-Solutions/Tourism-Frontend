import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./../Features/baseQuery";

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery,
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    // GET: Fetch reviews for a specific package
    getReviews: builder.query({
      query: ({ targetType, targetId }) => `/${targetType}/${targetId}/reviews`,
      transformResponse: (response) => {
        if (!Array.isArray(response)) return [];
        return response.map((review) => ({
          id: review.id,
          name: `${review.user.firstName} ${review.user.lastName}`,
          rating: review.rating,
          comment: review.comment,
          image: review.user.images,
          userId: review.user.id,
          createdAt: review.createdAt, 
          updatedAt: review.updatedAt,
        }));
      },
      providesTags: ["Reviews"],
    }),

    // POST: Add a review for a package
    addReview: builder.mutation({
      query: ({ targetType, targetId, ...rest }) => ({
        url: `/reviews`,
        method: "POST",
        body: {
          targetType,
          targetId,
          ...rest, // e.g., rating, comment
        },
      }),
      invalidatesTags: ["Reviews"],
    }),

    // PATCH: Edit a review
    editReview: builder.mutation({
      query: ({ reviewId, ...body }) => ({
        url: `/reviews/${reviewId}`,
        method: "PATCH",
        body, // { rating, comment }
      }),
      invalidatesTags: ["Reviews"],
    }),

    // DELETE: Delete a review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),

    // GET: Fetch average rating and review count
    getAverageReview: builder.query({
      query: ({ targetType, targetId }) =>
        `/${targetType}/${targetId}/reviews/average`,
      transformResponse: (response) => ({
        average: response.average,
        count: response.count,
      }),
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useAddReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
  useGetAverageReviewQuery,
} = feedbackApi;
