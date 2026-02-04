import { useGetReviewsQuery } from "../../../../../../../Services/feedbackApiSlice";
import ErrorMessage from "../../../../../../ErrorMessage";
import LoadingSpinner from "../../../../../../LoadingSpinner";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ReviewsTab = ({ packageData }) => {
  const targetId = packageData?.id;
  const targetType = "package";

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetReviewsQuery({
    targetType,
    targetId,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  if (isLoading)
    return (
      <div className="text-gray-600">
        <LoadingSpinner />
      </div>
    );

  if (isError && error?.status !== 404)
    return (
      <ErrorMessage
        message="Oops! Something went wrong while loading reviews."
        onRetry={refetch}
      />
    );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Reviews</h3>

      {reviews.length > 0 ? (
        <ul className="space-y-4">
          {reviews.map((review) => {
            const fullName = review.user 
              ? `${review.user.firstName} ${review.user.lastName}`.trim() 
              : review.name || "Anonymous";

            const avatar = review.user?.images
              ? `${API_BASE_URL}${review.user.images}`
              : review.image
              ? `${API_BASE_URL}${review.image}`
              : "/default-avatar.png";

            return (
              <li
                key={review.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{fullName}</p>
                    <p className="text-gray-500 text-sm">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="ml-auto text-yellow-500 font-bold">
                    {"⭐".repeat(review.rating || 0)}
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-600">No reviews yet for this package.</p>
      )}
    </div>
  );
};

export default ReviewsTab;