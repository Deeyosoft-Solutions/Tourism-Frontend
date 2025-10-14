import React, { useMemo, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useFormik } from "formik";
import JoditEditor from "jodit-react";
import PropTypes from "prop-types";

import {
  useGetProductBySlugQuery,
  useUpdateProductMutation,
} from "../../../../Services/productApiSlice";
import { useGetCategoriesQuery } from "../../../../Services/categoryApiSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UpdateProductModal = ({ isOpen, onClose, slug }) => {
  const [step, setStep] = useState(1);
  const editorRef = useRef(null);
  const [maxImagesReached, setMaxImagesReached] = useState(false);

  const {
    data,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery();

  const categories = Array.isArray(data?.data) ? data.data : [];

  // Fetch product data by slug
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useGetProductBySlugQuery(slug, {
    skip: !slug, // Skip if no slug
  });

  const [updateProduct] = useUpdateProductMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      price: product?.price || "",
      categoryId: product?.category?.id || "",
      tags: product?.tags?.join(", ") || "",
      stock: product?.stock || "",
      images: product?.images || [], // only one array now
      description: product?.description || "",
    },
    onSubmit: async (values) => {
      const payload = { id: product.id };

      if (values.name !== formik.initialValues.name) payload.name = values.name;
      if (values.price !== formik.initialValues.price)
        payload.price = Number(values.price);
      if (values.categoryId !== formik.initialValues.categoryId)
        payload.categoryId = values.categoryId;
      if (values.tags !== formik.initialValues.tags) {
        payload.tags = values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      if (values.stock !== formik.initialValues.stock)
        payload.stock = Number(values.stock);
      if (
        JSON.stringify(values.images) !==
        JSON.stringify(formik.initialValues.images)
      ) {
        payload.images = values.images; // just one array
      }
      if (values.description !== formik.initialValues.description)
        payload.description = values.description;

      try {
        await updateProduct(payload).unwrap();
        onClose();
      } catch (err) {
        console.error("Failed to update product:", err);
      }
    },
  });

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter product description...",
      height: 300,
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "align",
        "|",
        "link",
        "|",
        "undo",
        "redo",
      ],
      removeButtons: ["image", "video", "file"],
    }),
    []
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = formik.values.images.length;
    const remainingSlots = Math.max(0, 5 - totalImages);

    if (remainingSlots > 0) {
      const filesToAdd = files.slice(0, remainingSlots);
      formik.setFieldValue("images", [...formik.values.images, ...filesToAdd]);
      setMaxImagesReached(false);
    } else {
      setMaxImagesReached(true);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
    setMaxImagesReached(false);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
    setStep(1);
    setMaxImagesReached(false);
  };

  if (!isOpen) return null;

  if (isProductLoading) {
    return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-20 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg w-full md:w-1/2 relative shadow-2xl">
          <div className="flex justify-center items-center h-40">
            <p>Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isProductError) {
    return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-20 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg w-full md:w-1/2 relative shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Error</h2>
            <button
              onClick={onClose}
              className="hover:text-gray-500"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="text-red-500">
            Failed to load product data:{" "}
            {productError?.data?.message || "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-20 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full md:w-1/2 relative shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Product</h2>
          <button
            onClick={handleClose}
            className="hover:text-gray-500"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex mb-6">
          <div className="flex items-center">
            <div
              className={`rounded-full w-6 h-6 flex items-center justify-center ${
                step === 1 ? "bg-red-600 text-white" : "bg-gray-500 text-white"
              }`}
            >
              1
            </div>
            <span
              className={`ml-2 ${
                step === 1 ? "text-red-600 font-medium" : "text-gray-500"
              }`}
            >
              Basic Information
            </span>
          </div>
          <div className="mx-4 text-xl text-gray-600">&gt;</div>
          <div className="flex items-center">
            <div
              className={`rounded-full w-6 h-6 flex items-center justify-center ${
                step === 2 ? "bg-red-600 text-white" : "bg-gray-500 text-white"
              }`}
            >
              2
            </div>
            <span
              className={`ml-2 ${
                step === 2 ? "text-red-600 font-medium" : "text-gray-500"
              }`}
            >
              Description
            </span>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {formik.values.images?.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={
                          typeof image === "string"
                            ? `${API_BASE_URL}${image.url || image}`
                            : URL.createObjectURL(image)
                        }
                        alt="Product"
                        className="w-full h-full object-cover border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {[...Array(Math.max(0, 5 - formik.values.images.length))].map(
                    (_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="w-24 h-24 border border-gray-300 flex items-center justify-center"
                      >
                        <span className="text-gray-400">+</span>
                      </div>
                    )
                  )}
                </div>

                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  accept="image/*"
                  disabled={formik.values.images.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer px-4 py-2 rounded-lg block text-center ${
                    formik.values.images.length >= 5
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Add More Images
                </label>
                {maxImagesReached && (
                  <div className="text-red-500 text-sm mt-1">
                    Maximum 5 images allowed
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Rate of product"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formik.values.categoryId}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    disabled={isCategoriesLoading || isCategoriesError}
                  >
                    <option value="">Select Category</option>
                    {isCategoriesLoading && (
                      <option value="">Loading categories...</option>
                    )}
                    {isCategoriesError && (
                      <option value="">Error loading categories</option>
                    )}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="e.g., tag1, tag2, tag3"
                    value={formik.values.tags}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    placeholder="Amount of Products"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-14 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <JoditEditor
                    ref={editorRef}
                    value={formik.values.description}
                    onChange={(newContent) =>
                      formik.setFieldValue("description", newContent)
                    }
                    config={config}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-14 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="px-14 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                >
                  Update
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

UpdateProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
};

export default UpdateProductModal;
