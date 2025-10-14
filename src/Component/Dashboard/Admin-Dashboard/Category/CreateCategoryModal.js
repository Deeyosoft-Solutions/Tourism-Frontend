import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import the close (X) icon
import { useFormik } from "formik"; // Import Formik
import * as Yup from "yup"; // Import Yup for validation

const CreateCategoryModal = ({ isOpen, onClose, onCreate }) => {
  // State to force remount the modal
  const [modalKey, setModalKey] = useState(0);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      onCreate(values); // Pass form values to the parent component
      handleClose(); // Close and refresh the modal
    },
  });

  // Reset form, close modal, and refresh
  const handleClose = () => {
    formik.resetForm(); // Reset Formik state
    onClose(); // Close the modal
    setModalKey((prevKey) => prevKey + 1); // Force remount the modal
  };

  if (!isOpen) return null;

  return (
    <div
      key={modalKey} // Force remount when modalKey changes
      className="fixed inset-0 bg-gray-100 bg-opacity-20 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg w-1/2 relative shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-red-500 font-Open font-semibold items-center">Add Category</h2>
          <button
            onClick={handleClose}
            className="hover:text-gray-500"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4 justify-center">
            <div className="mb-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Category Name"
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                placeholder="Brief overview"
                name="description"
                id="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="1"
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-14 py-2 font-Open bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
