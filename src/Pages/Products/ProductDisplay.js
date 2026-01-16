import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import RatingStars from "./../../Component/RatingStars";
import { useGetProductBySlugQuery } from "../../Services/productApiSlice";
import { useAddToCartMutation } from "../../Services/cartSlice";
import ErrorToast from "../../Component/ErrorToast";
import { useGetAverageReviewQuery, useGetReviewsQuery, useAddReviewMutation, useDeleteReviewMutation, useEditReviewMutation } from "../../Services/feedbackApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import LoadingSpinner from "../../Component/LoadingSpinner";
import ErrorMessage from "../../Component/ErrorMessage";
import { useFetchUserProfileQuery } from "../../Services/userApiSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, isError } = useGetProductBySlugQuery(slug);
  const [addToCart] = useAddToCartMutation();
  const product = data;
  
  const { data: averageData, isLoading: avgLoading } = useGetAverageReviewQuery(
    product?.id ? { targetType: "product", targetId: product.id } : skipToken
  );
  
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryContainerRef = useRef(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Feedback states
  const { data: userProfile } = useFetchUserProfileQuery();
  const isLoggedIn = !!userProfile;
  const {
    data: feedback = [],
    isLoading: feedbackLoading,
    error: feedbackError,
  } = useGetReviewsQuery(
    product?.id ? { targetType: "product", targetId: product.id } : skipToken
  );
  const [addReview] = useAddReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();
  const [editReview] = useEditReviewMutation();
  
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ reviewId: "", rating: 0, comment: "" });

  // Quantity handlers
  const increaseQuantity = () => {
    if (product && product.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCartClick = async () => {
    if (!product) return;

    if (product.stock && quantity > product.stock) {
      setErrorMessage(
        `Cannot add more than available stock (${product.stock})`
      );
      setShowErrorToast(true);
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: quantity,
      });
      navigate(`/localproducts/cart`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setErrorMessage("Failed to add item to cart");
      setShowErrorToast(true);
    }
  };

  // Scroll functions
  const scrollUp = () => {
    if (galleryContainerRef.current) {
      galleryContainerRef.current.scrollBy({ top: -100, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (galleryContainerRef.current) {
      galleryContainerRef.current.scrollBy({ top: 100, behavior: "smooth" });
    }
  };

  // Feedback handlers
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id).unwrap();
    } catch (error) {
      alert("Failed to delete review");
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditData({ reviewId: item.id, rating: item.rating, comment: item.comment });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editReview(editData).unwrap();
      setEditModalOpen(false);
    } catch (error) {
      alert("Failed to update review");
      console.error(error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newRating === 0 || newComment.trim() === "") {
      alert("Please provide a rating and a comment.");
      return;
    }
    setSubmitting(true);
    try {
      await addReview({
        targetType: "product",
        targetId: product.id,
        rating: newRating,
        comment: newComment,
      }).unwrap();
      setNewRating(0);
      setNewComment("");
    } catch (error) {
      alert("Failed to submit review");
    }
    setSubmitting(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError || !product) return <ErrorMessage message="Failed to load products." />;

  const images = product.images || [];
  const reviewsToShow = showAll ? feedback : feedback.slice(0, 9);

  return (
    <div className="lg:p-4 md:p-1 my-2 font-poppins">
      {/* Product Display Section */}
      <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-lg">
        {/* Left: Image Gallery */}
        <div className="flex flex-col md:flex-row md:space-x-2 w-full md:w-1/2">
          {/* Horizontal scroll (mobile) */}
          <div className="md:hidden flex overflow-x-auto bg-white space-x-2 p-2 mb-2">
            {images.length > 0 ? (
              images.map((img, index) => (
                <img
                  key={index}
                  src={`${API_BASE_URL}${img}`}
                  alt="Gallery"
                  className="w-16 h-16 object-cover border-2 rounded cursor-pointer hover:border-red-500"
                  onClick={() => setSelectedImage(`${API_BASE_URL}${img}`)}
                />
              ))
            ) : (
              <p className="text-gray-500">No gallery images</p>
            )}
          </div>

          {/* Vertical scroll (desktop) */}
          <div className="hidden md:flex flex-col items-center space-y-2">
            <button
              onClick={scrollUp}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>

            <div
              ref={galleryContainerRef}
              className="flex flex-col space-y-2 overflow-y-auto max-h-[400px] pr-1"
            >
              {images.length > 0 ? (
                images.map((img, index) => (
                  <img
                    key={index}
                    src={`${API_BASE_URL}${img}`}
                    alt="Gallery"
                    className="w-20 h-20 object-cover border-2 rounded cursor-pointer hover:border-red-500"
                    onClick={() => setSelectedImage(`${API_BASE_URL}${img}`)}
                  />
                ))
              ) : (
                <p className="text-gray-500">No gallery images</p>
              )}
            </div>

            <button
              onClick={scrollDown}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4">
            <img
              src={
                selectedImage ||
                (images.length > 0
                  ? `${API_BASE_URL}${images[0]}`
                  : "/default-product.png")
              }
              alt={product.name || "No Image"}
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>
          
          {avgLoading ? (
            <p className="text-sm text-gray-500">Loading ratings...</p>
          ) : (
            <div className="flex items-center gap-2">
              <RatingStars rating={averageData?.average || 0} />
              <span className="text-sm text-gray-600 mt-2.5">
                {averageData?.count || 0} Review{averageData?.count !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <p className="text-2xl font-bold text-red-600">
            Nrs {product.price}
          </p>

          {product?.stock && (
            <p className="text-sm text-gray-600">
              ({product.stock} in stock)
            </p>
          )}

          <div className="py-3 border-t border-b">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Seller:</span>{" "}
              <span className="text-blue-600">
                {product.seller
                  ? `${product.seller.firstName || ""} ${product.seller.lastName || ""}`
                  : "No seller info"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 py-2">
            <span className="text-gray-700 font-medium">Share item:</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-colors">
                <FaFacebookF size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-400 hover:text-white transition-colors">
                <FaTwitter size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-600 hover:text-white transition-colors">
                <FaPinterestP size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-600 hover:text-white transition-colors">
                <FaInstagram size={14} />
              </button>
            </div>
          </div>

          <div className="py-3">
            <p className="text-gray-700 text-sm mb-3">
              <span className="font-semibold">Category:</span>{" "}
              {product.category?.name || "Uncategorized"}
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Tag:</span>{" "}
              {product.tags?.length > 0 ? product.tags.join(", ") : "Vegetables, Healthy, Cabbage, Green Cabbage"}
            </p>
          </div>

          <div className="flex items-center gap-4 py-3">
            <div className="flex items-center border-2 rounded-md">
              <button
                onClick={decreaseQuantity}
                className={`px-4 py-2 text-lg font-semibold ${
                  quantity <= 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-6 py-2 border-x-2 font-semibold">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className={`px-4 py-2 text-lg font-semibold ${
                  product?.stock && quantity >= product.stock
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                disabled={product?.stock && quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 text-white bg-red-600 rounded-full hover:bg-red-700 font-semibold transition-colors"
              onClick={handleAddToCartClick}
            >
              Add To Cart <HiOutlineShoppingBag size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-8 bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
        <div className="text-gray-700 leading-relaxed">
          {product.description ? (
            <span dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </div>

      {/* Customer Feedback Section */}
      <div className="mt-8 bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {feedback.length} {feedback.length === 1 ? "Review" : "Reviews"}
          </h2>
        </div>

        {feedbackLoading ? (
          <p className="text-gray-500">Loading feedback...</p>
        ) : feedbackError ? (
          <p className="text-red-500">Failed to load feedback.</p>
        ) : feedback.length > 0 ? (
          <>
            <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2">
              {reviewsToShow.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600">
                          {item.name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <RatingStars rating={item.rating} />
                      <p className="text-sm text-gray-600 mt-2">{item.comment}</p>
                    </div>
                    {userProfile?.id === item.userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                          disabled={deleting}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {feedback.length > 9 && !showAll && (
              <div className="mb-6 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  See more
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}

        {/* Give a review section */}
        {isLoggedIn && (
          <form onSubmit={handleSubmitReview} className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Give a Review</h3>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Your Rating</label>
              <RatingStars rating={newRating} onChange={(val) => setNewRating(val)} interactive />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Your Review</label>
              <textarea
                className="w-full border rounded-md p-3"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                placeholder="Write your review here..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 disabled:opacity-50 font-semibold"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Edit modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Review</h2>
            <form onSubmit={handleEditSubmit}>
              <label className="block mb-2 font-medium">Rating</label>
              <RatingStars
                rating={editData.rating}
                onChange={(val) => setEditData((prev) => ({ ...prev, rating: val }))}
                interactive
              />
              <label className="block mt-4 mb-2 font-medium">Comment</label>
              <textarea
                value={editData.comment}
                onChange={(e) => setEditData((prev) => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full border p-3 rounded"
                required
              />
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 font-semibold"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <ErrorToast
            message={errorMessage}
            onClose={() => setShowErrorToast(false)}
            duration={5000}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;