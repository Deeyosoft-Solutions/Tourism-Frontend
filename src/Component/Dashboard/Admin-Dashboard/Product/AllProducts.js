import { useState, useEffect } from "react";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../../Services/productApiSlice";
import { BiFilterAlt, BiSearch } from "react-icons/bi";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import CreateProductModal from "./CreateProductModal";
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorMessage from "../../../ErrorMessage";
import SuccessToast from "../../../SuccessToast";
import ErrorToast from "../../../ErrorToast";
import UpdateProductModal from "./UpdateProductModal";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const MyProducts = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // API hooks
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Derived data
  const products = response?.data || [];
  const filteredProducts = products.filter((product) => {
    // Handle cases where product or product.name might be undefined/null
    const productName = product?.name || "";
    const searchText = searchTerm || "";

    return productName.toLowerCase().startsWith(searchText.toLowerCase());
  });

  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      // Cleanup any object URLs when component unmounts
      document.querySelectorAll("img[src^='blob:']").forEach((img) => {
        URL.revokeObjectURL(img.src);
      });
    };
  }, []);

  const handleCreateProduct = async (newProduct) => {
    try {
      // Validation
      const requiredFields = [
        "name",
        "price",
        "category",
        "description",
        "stock",
        "unit",
      ];
      const missingFields = requiredFields.filter(
        (field) => !newProduct[field] && newProduct[field] !== 0
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing fields: ${missingFields.join(", ")}`);
      }

      // Type validation
      const price = Number(newProduct.price);
      if (isNaN(price)) throw new Error("Price must be a number");

      // Prepare FormData
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", price.toString());
      formData.append("categoryId", newProduct.categoryId);
      formData.append("description", newProduct.description);
      formData.append("stock", newProduct.stock);
      formData.append("unit", newProduct.unit);

      // Optional fields
      if (newProduct.tags) {
        const tagsArray = Array.isArray(newProduct.tags)
          ? newProduct.tags
          : JSON.parse(newProduct.tags);
        formData.append("tags", JSON.stringify(tagsArray));
      }

      // Image validation and handling
      if (!newProduct.images || newProduct.images.length === 0) {
        throw new Error("At least one image is required");
      }

      newProduct.images.forEach((image) => {
        if (!image.type?.startsWith("image/")) {
          throw new Error("Only image files are allowed");
        }
        if (image.size > 5_000_000) {
          throw new Error("Image size must be less than 5MB");
        }
        formData.append("images", image);
      });

      // Send request
      const response = await createProduct(formData).unwrap();

      // Show success notification
      setNotification({
        show: true,
        message: "Product created successfully!",
        type: "success",
      });

      // Close modal and refetch products
      setIsModalOpen(false);
      refetch();

      return response;
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || "Failed to create product",
        type: "error",
      });
      throw error;
    }
  };

  const handleUpdateProduct = (slug) => {
    setSelectedProductId(slug);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!isConfirmed) return;

    try {
      await deleteProduct(id).unwrap();
      setNotification({
        show: true,
        message: "Product deleted successfully!",
        type: "success",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setNotification({
        show: true,
        message: error.message || "Failed to delete product",
        type: "error",
      });
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError)
    return (
      <ErrorMessage
        message={error?.message || "Error fetching products"}
        onRetry={refetch}
      />
    );

  return (
    <div className="p-4 min-h-full">
      {/* Notification Toasts */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          {notification.type === "success" ? (
            <SuccessToast
              message={notification.message}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          ) : (
            <ErrorToast
              message={notification.message}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          )}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center py-2 mb-3 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative flex w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <BiSearch
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            className="px-3 py-2 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 w-full md:w-auto"
            aria-label="Filter products"
          >
            Filter <BiFilterAlt size={18} className="ml-2" />
          </button>
        </div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full md:w-auto disabled:opacity-50"
          onClick={() => setIsModalOpen(true)}
          disabled={isCreating}
          aria-label="Add new product"
        >
          {isCreating ? <LoadingSpinner size="small" /> : "+ Add Product"}
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-sm shadow overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Product Image
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 text-center"
                  >
                    <td className="px-4 md:px-6 py-3">
                      {product.images?.[0] ? (
                        <img
                          src={
                            product.images?.[0]
                              ? `${API_BASE_URL}${product.images[0]}`
                              : "/public/assets/Images/product-default.png"
                          }
                          alt={product.name || "Product image"}
                          className="w-14 h-14 rounded-sm object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-gray-200 flex items-center justify-center">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-gray-800">
                      {product.name}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-gray-800">
                      {product.category?.name || product.category || "N/A"}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-gray-800">
                      Rs.
                      {isNaN(Number(product.price))
                        ? "0.00"
                        : Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-gray-800">
                      {product.stock ?? "N/A"}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-gray-800">
                      {product.unit ?? "N/A"}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-gray-800 capitalize">
                      {product.status || "N/A"}
                    </td>
                    <td className="px-4 md:px-6 py-3">
                      <div className="flex space-x-2 justify-center">
                        <button
                          className="text-green-500 hover:text-green-600 focus:outline-none"
                          onClick={() => handleUpdateProduct(product.slug)}
                          aria-label={`Edit ${product.name}`}
                          disabled={isDeleting}
                        >
                          <FaPencilAlt className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600 focus:outline-none"
                          onClick={() => handleDelete(product.id)}
                          aria-label={`Delete ${product.name}`}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <FaTrashAlt className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 md:px-6 py-4 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No matching products found"
                      : "No products available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        isSubmitting={isCreating}
      />

      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedProductId(null);
        }}
        slug={selectedProductId}
      />
    </div>
  );
};

export default MyProducts;
