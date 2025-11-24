import React, { useRef, useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";

const CreateTravelPackageModal = ({ isOpen, onClose, onCreate }) => {
  const editorRef = useRef(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter package description...",
      height: 250,
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

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      durationDays: "",
      durationNights: "",
      coverImage: null,
      images: [],
      included: [""],
      notIncluded: [""],
      destinationIds: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number().required("Price is required").positive(),
      durationDays: Yup.number().required("Days required").min(1),
      durationNights: Yup.number().required("Nights required").min(0),
      destinationIds: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one destination"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "coverImage" && values.coverImage) {
          formData.append("coverImage", values.coverImage);
        } else if (key === "images") {
          values.images.forEach((file) => formData.append("images", file));
        } else if (Array.isArray(values[key])) {
          values[key].forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, values[key]);
        }
      });
      await onCreate(formData);
      formik.resetForm();
      setCoverPreview(null);
      setImagePreviews([]);
    },
  });

  // Gallery image handlers
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    formik.setFieldValue("images", files);
  };

  const removeGalleryImage = (index) => {
    const newImages = [...formik.values.images];
    const newPreviews = [...imagePreviews];

    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    formik.setFieldValue("images", newImages);
    setImagePreviews(newPreviews);
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [coverPreview, imagePreviews]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white py-6 px-8 rounded-2xl w-full md:w-3/5 relative shadow-black shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-red-600 font-semibold">
            Create Travel Package
          </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-500"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Cover Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-100">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">+</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="cover-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    formik.setFieldValue("coverImage", file);
                    setCoverPreview(URL.createObjectURL(file));
                  }}
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Upload Cover
                </label>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-24 border border-gray-300 flex items-center justify-center relative"
                >
                  {imagePreviews[index] ? (
                    <>
                      <img
                        src={imagePreviews[index]}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:bg-gray-200"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 cursor-pointer">+</span>
                  )}
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              onChange={handleGalleryChange}
              className="hidden"
              id="image-upload"
              accept="image/*"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 block text-center"
            >
              Add Images
            </label>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                {...formik.getFieldProps("name")}
                className="w-full p-2 border rounded-lg"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                {...formik.getFieldProps("price")}
                className="w-full p-2 border rounded-lg"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-sm">
                  {formik.errors.price}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration Days *
              </label>
              <input
                type="number"
                {...formik.getFieldProps("durationDays")}
                className="w-full p-2 border rounded-lg"
              />
              {formik.touched.durationDays && formik.errors.durationDays && (
                <div className="text-red-500 text-sm">
                  {formik.errors.durationDays}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration Nights *
              </label>
              <input
                type="number"
                {...formik.getFieldProps("durationNights")}
                className="w-full p-2 border rounded-lg"
              />
              {formik.touched.durationNights &&
                formik.errors.durationNights && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.durationNights}
                  </div>
                )}
            </div>
          </div>

          {/* Included / Not Included */}
          <div className="grid grid-rows-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What's Included
              </label>
              {formik.values.included.map((item, idx) => (
                <div key={idx} className="flex gap-2 mt-1 items-center">
                  <input
                    type="text"
                    placeholder="Accommodation, Breakfast, etc"
                    value={item}
                    onChange={(e) => {
                      const arr = [...formik.values.included];
                      arr[idx] = e.target.value;
                      formik.setFieldValue("included", arr);
                    }}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...formik.values.included];
                      arr.splice(idx, 1);
                      formik.setFieldValue("included", arr.length ? arr : [""]);
                    }}
                    className="text-red-500 px-2"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  formik.setFieldValue("included", [
                    ...formik.values.included,
                    "",
                  ])
                }
                className="mt-1 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                + Add
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What's Not Included
              </label>
              {formik.values.notIncluded.map((item, idx) => (
                <div key={idx} className="flex gap-2 mt-1 items-center">
                  <input
                    type="text"
                    placeholder="Insurance, etc"
                    value={item}
                    onChange={(e) => {
                      const arr = [...formik.values.notIncluded];
                      arr[idx] = e.target.value;
                      formik.setFieldValue("notIncluded", arr);
                    }}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...formik.values.notIncluded];
                      arr.splice(idx, 1);
                      formik.setFieldValue(
                        "notIncluded",
                        arr.length ? arr : [""]
                      );
                    }}
                    className="text-red-500 px-2"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  formik.setFieldValue("notIncluded", [
                    ...formik.values.notIncluded,
                    "",
                  ])
                }
                className="mt-1 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <JoditEditor
              ref={editorRef}
              value={formik.values.description}
              onChange={(val) => formik.setFieldValue("description", val)}
              config={config}
              onBlur={() => formik.setFieldTouched("description", true)}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm">
                {formik.errors.description}
              </div>
            )}
          </div>

          {/* Destinations */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Destination ID/Slug *
            </label>
            <input
              type="text"
              placeholder="Comma separated IDs"
              value={formik.values.destinationIds.join(",")}
              onChange={(e) =>
                formik.setFieldValue(
                  "destinationIds",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              className="w-full p-2 border rounded-lg"
            />
            {formik.touched.destinationIds && formik.errors.destinationIds && (
              <div className="text-red-500 text-sm">
                {formik.errors.destinationIds}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Create Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTravelPackageModal;
