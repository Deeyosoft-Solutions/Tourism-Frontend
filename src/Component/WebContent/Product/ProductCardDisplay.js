import { HiOutlineShoppingBag } from "react-icons/hi";
import RatingStars from "./../../RatingStars";
import { useNavigate } from "react-router-dom";
import { useGetAverageReviewQuery } from "../../../Services/feedbackApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAddToCartMutation } from "../../../Services/cartSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProductCard = ({ product, handleProductClick }) => {
  const navigate = useNavigate();
  const [addToCart] = useAddToCartMutation();

  const handleAddToCartClick = async () => {
    if (!product?.id) return;

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });

      navigate("/localproducts/cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const { data: averageData, isLoading: avgLoading } = useGetAverageReviewQuery(
    product?.id ? { targetType: "product", targetId: product.id } : skipToken
  );

  // Safely access product properties with fallbacks
  const productImages = product?.images || [];
  const firstImage =
    productImages.length > 0
      ? `${API_BASE_URL}${productImages[0]}`
      : "/placeholder-image.jpg";

  const productName = product?.name || "Unnamed Product";
  const productPrice = product?.price || 0;

  return (
    <div
      key={product?.id}
      className="border p-2 rounded-md cursor-pointer hover:border hover:text-blue-400 hover:border-blue-400 hover:shadow-lg"
      onClick={() => handleProductClick(product)}
    >
      <div className="w-full h-40 flex items-center justify-center mb-2 bg-gray-100 rounded-sm">
        <img
          src={firstImage}
          alt={productName}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>
      <div className="grid grid-cols-3 items-center">
        <div className="flex flex-col col-span-2 justify-center">
          <h2 className="text-gray-700 text-[12px] overflow-hidden font-semibold font-poppins">
            {productName}
          </h2>
          <p className="text-red-600 text-base font-bold font-poppins">
            Nrs. {productPrice.toLocaleString()}
          </p>
          {avgLoading ? (
            <p className="text-sm text-gray-500">Loading ratings...</p>
          ) : (
            <div className="flex items-center gap-2">
              <RatingStars rating={averageData?.average || 0} />
            </div>
          )}
        </div>
        <div className="flex items-center m-3 justify-center">
          <button
            className="items-center bg-blue-500 text-white px-3 py-2 rounded-full shadow-sm hover:bg-blue-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCartClick();
            }}
          >
            <HiOutlineShoppingBag className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
