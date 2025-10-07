import { useState } from "react";
import { FaPlus, FaTimes, FaPencilAlt, FaTrashAlt } from "react-icons/fa";

import LoadingSpinner from "../../../../LoadingSpinner";
import ErrorMessage from "../../../../ErrorMessage";
import {
  useAddAccomodationCategoryMutation,
  useDeleteAccomodationCategoryMutation,
  useGetAccomodationCategoriesQuery,
} from "../../../../../Services/accomodationCategory.ApiSlice";

const AccomodationType = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccomodationCategoriesQuery();
  const [addCategory] = useAddAccomodationCategoryMutation();
  const [deleteCategory] = useDeleteAccomodationCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new accommodation type
  const handleAddType = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addCategory({ name, description }).unwrap();
      setName("");
      setDescription("");
      setErrors({});
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  // Delete a type
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  // Placeholder for edit
  const handleUpdate = (slug) => {
    alert(`Edit functionality for: ${slug} (implement separately)`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Accommodation Types
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
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
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 md:px-6 py-4 text-center text-gray-500"
                    >
                      <LoadingSpinner /> Loading accommodation types...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 md:px-6 py-4 text-center text-red-500"
                    >
                      <ErrorMessage
                        message={
                          error?.message || "Error fetching accommodation types"
                        }
                        onRetry={refetch}
                      />
                    </td>
                  </tr>
                ) : categories?.data?.length > 0 ? ( // ← directly use categories array
                  categories.data.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-100 text-center">
                      <td className="px-4 md:px-6 py-3 text-gray-800">
                        {type.name}
                      </td>
                      <td
                        className="px-4 md:px-6 py-3 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ maxWidth: "200px" }}
                        title={type.description}
                      >
                        {type.description}
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="flex space-x-2 justify-center">
                          <div
                            className="text-green-500 hover:text-green-600 cursor-pointer"
                            onClick={() => handleUpdate(type.slug)}
                            title="Edit"
                          >
                            <FaPencilAlt className="w-4 h-4" />
                          </div>
                          <div
                            className="text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={() => handleDelete(type.id)}
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
                    <td
                      colSpan="3"
                      className="px-4 md:px-6 py-4 text-center text-gray-500"
                    >
                      No accommodation types available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={18} />
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Add Accommodation Type
              </h3>

              <form onSubmit={handleAddType}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter accommodation name"
                  />
                  {errors.name && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Enter brief description"
                  />
                  {errors.description && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccomodationType;
