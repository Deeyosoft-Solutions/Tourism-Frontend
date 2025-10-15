import { useState } from "react";
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import LoadingSpinner from "../../../../LoadingSpinner";
import ErrorMessage from "../../../../ErrorMessage";
import {
  useDeleteAccomodationCategoryMutation,
  useGetAccomodationCategoriesQuery,
} from "../../../../../Services/accomodationCategoryApiSlice";
import CreateAccomodationTypeModal from "./CreateAccomodationType";
import UpdateAccomodationTypeModal from "./UpdateAccomodationType";
import SuccessToast from "../../../../SuccessToast";
import ErrorToast from "../../../../ErrorToast";

const AccomodationType = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccomodationCategoriesQuery();

  const [deleteCategory] = useDeleteAccomodationCategoryMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'success' | 'error'
  });

  // Delete a type with confirmation
  const handleDelete = async (slug, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this accommodation type: "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteCategory(slug).unwrap();
      setNotification({
        show: true,
        message: `Accommodation type "${name}" deleted successfully!`,
        type: "success",
      });
      refetch();
    } catch (err) {
      setNotification({
        show: true,
        message: err?.data?.message || "Failed to delete accommodation type",
        type: "error",
      });
      console.error("Failed to delete category:", err);
    }
  };

  // Open update modal
  const handleUpdate = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Notification */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-50">
            {notification.type === "success" ? (
              <SuccessToast
                message={notification.message}
                onClose={() =>
                  setNotification({ ...notification, show: false })
                }
              />
            ) : (
              <ErrorToast
                message={notification.message}
                onClose={() =>
                  setNotification({ ...notification, show: false })
                }
              />
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-red-500">
            Accommodation Types
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaPlus /> Add Type
          </button>
        </div>

        {/* Table */}
        <div className="rounded-sm shadow overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6">
                      <LoadingSpinner /> Loading accommodation types...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-red-500">
                      <ErrorMessage
                        message={
                          error?.message || "Error fetching accommodation types"
                        }
                        onRetry={refetch}
                      />
                    </td>
                  </tr>
                ) : categories?.data?.length > 0 ? (
                  categories.data.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-100 text-center">
                      <td className="px-4 py-3 text-gray-800">{type.name}</td>
                      <td
                        className="px-4 py-3 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ maxWidth: "200px" }}
                        title={type.description}
                      >
                        {type.description}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2 justify-center">
                          <div
                            className="text-green-500 hover:text-green-600 cursor-pointer"
                            onClick={() => handleUpdate(type)}
                            title="Edit"
                          >
                            <FaPencilAlt className="w-4 h-4" />
                          </div>
                          <div
                            className="text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={() => handleDelete(type.slug, type.name)}
                            aria-label={`Delete ${type.name}`}
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No accommodation types available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {isCreateModalOpen && (
          <CreateAccomodationTypeModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreateSuccess={(message) => {
              setNotification({ show: true, message, type: "success" });
              refetch();
              setIsCreateModalOpen(false);
            }}
          />
        )}

        {isUpdateModalOpen && selectedCategory && (
          <UpdateAccomodationTypeModal
            category={selectedCategory}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedCategory(null);
            }}
            onUpdateSuccess={(message) => {
              setNotification({ show: true, message, type: "success" });
              setIsUpdateModalOpen(false);
              setSelectedCategory(null);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AccomodationType;
