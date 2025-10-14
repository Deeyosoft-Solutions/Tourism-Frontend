import React, { useMemo, useRef, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { useGetCategoriesQuery } from "../../../../Services/categoryApiSlice";

const CreateProductModal = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const editorRef = useRef(null);
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const categories = Array.isArray(data?.data) ? data.data : [];

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      tags: "",
      stock: "",
      unit: "",
      images: [],
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
      category: Yup.string().required("Category is required"),
      tags: Yup.string(), // No longer required since we'll convert to array
      stock: Yup.number()
        .typeError("Stock must be a number")
        .positive("Stock must be positive")
        .integer("Stock must be a whole number")
        .notRequired(),
      unit: Yup.string().required("Unit is required"),
      images: Yup.array()
        .test(
          "fileSize",
          "File too large (max 5MB)",
          (values) => !values || values.every((file) => file.size <= 5_000_000)
        )
        .notRequired(),
      description: Yup.string()
        .required("Description is required")
        .min(20, "Description should be at least 20 characters"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        categoryId: values.category,
        unit: values.unit || "",
        price: Number(values.price),
        stock: values.stock ? Number(values.stock) : undefined,
        tags: Array.isArray(values.tags)
          ? values.tags
          : values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag),
        images: values.images || [],
      };
      await onCreate(payload);
    },
  });

  // Cleanup effects
  useEffect(() => {
    const editorInstance = editorRef.current;
    const imageUrls = formik.values.images
      ?.filter((img) => img instanceof Blob)
      ?.map((img) => URL.createObjectURL(img));

    return () => {
      // Cleanup image preview URLs
      imageUrls?.forEach((url) => URL.revokeObjectURL(url));

      // Cleanup editor
      if (editorInstance?.destruct && !editorInstance?.isDestructed) {
        try {
          editorInstance.destruct();
        } catch (error) {
          console.warn("Editor cleanup error:", error);
        }
      }
    };
  }, [formik.values.images]);

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
    const files = Array.from(e.target.files).slice(0, 5);
    formik.setFieldValue("images", files);
  };

  const handleNextStep = async () => {
    const fieldsToValidate = [
      "name",
      "price",
      "category",
      "tags",
      "stock",
      "images",
    ];
    await Promise.all(
      fieldsToValidate.map((field) => formik.validateField(field))
    );

    if (fieldsToValidate.every((field) => !formik.errors[field])) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleClose = () => {
    // Clear editor content safely
    if (editorRef.current?.value) {
      editorRef.current.value = "";
    }
    formik.resetForm();
    onClose();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-20 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full md:w-1/2 relative shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">List Products</h2>
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
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 border border-gray-300 flex items-center justify-center"
                    >
                      {formik.values.images[index] ? (
                        <img
                          src={URL.createObjectURL(formik.values.images[index])}
                          alt="Upload preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">+</span>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 block text-center"
                >
                  Add Product Images
                </label>
                {formik.touched.images && formik.errors.images && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.images}
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
                    {...formik.getFieldProps("name")}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Rate of product"
                    {...formik.getFieldProps("price")}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.price}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    {...formik.getFieldProps("category")}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    disabled={isLoading || isError}
                  >
                    <option value="">Select Category</option>
                    {isLoading && (
                      <option value="">Loading categories...</option>
                    )}
                    {isError && (
                      <option value="">Error loading categories</option>
                    )}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.category}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="e.g., tag1, tag2, tag3"
                    {...formik.getFieldProps("tags")}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {formik.touched.tags && formik.errors.tags && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.tags}
                    </div>
                  )}
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
                    {...formik.getFieldProps("stock")}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {formik.touched.stock && formik.errors.stock && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.stock}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., kg, piece"
                    {...formik.getFieldProps("unit")}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {formik.touched.unit && formik.errors.unit && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.unit}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-14 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
                    onBlur={() => formik.setFieldTouched("description", true)}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.description}
                    </div>
                  )}
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
                  className="px-14 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
