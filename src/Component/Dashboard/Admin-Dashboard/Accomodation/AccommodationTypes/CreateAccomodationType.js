import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddAccomodationCategoryMutation } from "../../../../../Services/accomodationCategoryApiSlice";

const CreateAccomodationTypeModal = ({ onClose, onCreateSuccess }) => {
  const [addCategory] = useAddAccomodationCategoryMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addCategory({ name, description }).unwrap();
      // Call parent callback for success
      onCreateSuccess(`Accommodation type "${name}" created successfully!`);
    } catch (err) {
      console.error("Failed to add category:", err);
      onCreateSuccess(
        err?.data?.message || "Failed to create accommodation type",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={18} />
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Add Accommodation Type
        </h3>

        <form onSubmit={handleAdd}>
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
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccomodationTypeModal;
