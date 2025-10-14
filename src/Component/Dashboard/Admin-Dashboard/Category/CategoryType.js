import { useState } from "react";
import { BiFilterAlt, BiSearch } from "react-icons/bi";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../../../Services/categoryApiSlice";
import CreateCategoryModal from "./CreateCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import SuccessToast from "../../../SuccessToast";
import ErrorToast from "../../../ErrorToast";
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorMessage from "../../../ErrorMessage";

const CategoryType = () => {
  const {
    data: categoriesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = async (newCategory) => {
    try {
      await createCategory(newCategory).unwrap();
      setNotification({
        show: true,
        message: "Category created successfully!",
        type: "success",
      });
      refetch();
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || "Failed to create category",
        type: "error",
      });
    }
  };

  const handleUpdate = (slug) => {
    setSelectedCategoryId(slug);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (isConfirmed) {
      try {
        await deleteCategory(id).unwrap();
        setNotification({
          show: true,
          message: "Category deleted successfully!",
          type: "success",
        });
        refetch();
      } catch (error) {
        console.error("Failed to delete category:", error);
        setNotification({
          show: true,
          message: error.message || "Failed to delete category",
          type: "error",
        });
      }
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

      {/* Search and Filter Section */}
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
            onClick={() => refetch()}
          >
            Filter <BiFilterAlt size={18} className="ml-2" />
          </button>
        </div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full md:w-auto disabled:opacity-50"
          onClick={() => setIsModalOpen(true)}
          disabled={isCreating}
          aria-label="Add new Category"
        >
          {isCreating ? <LoadingSpinner size="small" /> : "+ Add Category"}
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-sm shadow overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium tracking-wider">
                  Name
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium tracking-wider">
                  Description
                </th>
                <th className="px-4 md:px-6 py-2 text-center text-xs font-medium tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories?.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-100 text-center"
                  >
                    <td className="px-4 md:px-6 py-3 text-gray-800">
                      {category.name}
                    </td>
                    <td
                      className="px-4 md:px-6 py-3 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ maxWidth: "200px" }}
                      title={category.description}
                    >
                      {category.description}
                    </td>
                    <td className="px-4 md:px-6 py-3">
                      <div className="flex space-x-2 justify-center">
                        <button
                          type="button"
                          className="text-green-500 hover:text-green-600"
                          onClick={() => handleUpdate(category.slug)}
                          title="Edit"
                        >
                          <FaPencilAlt className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          className={`text-red-500 hover:text-red-600 flex items-center justify-center ${
                            isDeleting ? "cursor-not-allowed opacity-50" : ""
                          }`}
                          onClick={() =>
                            !isDeleting && handleDelete(category.id)
                          }
                          aria-label={`Delete ${category.name}`}
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
                    <p>No categories available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCategory}
      />

      <UpdateCategoryModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedCategoryId(null);
        }}
        slug={selectedCategoryId}
        onUpdateSuccess={(message, type = "success") => {
          setNotification({ show: true, message, type });
          refetch();
        }}
      />
    </div>
  );
};

export default CategoryType;
