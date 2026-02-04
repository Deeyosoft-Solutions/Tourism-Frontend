import { useState } from "react";
import PropTypes from "prop-types";
import { FaCamera } from "react-icons/fa";
import { useCreateTravelPackageMutation } from "../../../Services/travelPackageApiSlice";

const CreatePackageModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationDays: "",
    durationNights: "",
    included: [],
    notIncluded: [],
    destinations: [],
    bookingLeadHours: "",
    defaultDepartureCapacity: "",
    coverImage: null, // ✅ ADDED
    images: [],
  });

  const [coverPreview, setCoverPreview] = useState(null); // ✅ ADDED
  const [imagePreviews, setImagePreviews] = useState([]);

  const [createTravelPackage, { isLoading }] = useCreateTravelPackageMutation();
  const [error, setError] = useState("");

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    setFormData({ ...formData, coverImage: file });
    setCoverPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData({ ...formData, images: files });
    setImagePreviews(previews);
    setError("");
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);

    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.durationDays ||
      !formData.durationNights
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const submitData = new FormData();

      // Basic fields
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("price", formData.price);
      submitData.append("durationDays", Number(formData.durationDays));
      submitData.append("durationNights", Number(formData.durationNights));

      if (formData.bookingLeadHours)
        submitData.append(
          "bookingLeadHours",
          Number(formData.bookingLeadHours)
        );

      if (formData.defaultDepartureCapacity)
        submitData.append(
          "defaultDepartureCapacity",
          Number(formData.defaultDepartureCapacity)
        );

      // Arrays
      formData.included.forEach((item) => submitData.append("included", item));

      formData.notIncluded.forEach((item) =>
        submitData.append("notIncluded", item)
      );

      formData.destinations.forEach((dest) =>
        submitData.append("destinations", dest)
      );

      // COVER IMAGE
      submitData.append("coverImage", formData.coverImage);

      // MULTIPLE IMAGES
      formData.images.forEach((img) => {
        submitData.append("images", img);
      });

      // DEBUG
      console.log("\n==== FORM SUBMIT ====");
      for (let pair of submitData.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      await createTravelPackage(submitData).unwrap();

      // Cleanup
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        durationDays: "",
        durationNights: "",
        included: [],
        notIncluded: [],
        destinations: [],
        bookingLeadHours: "",
        defaultDepartureCapacity: "",
        coverImage: null,
        images: [],
      });

      setCoverPreview(null);
      setImagePreviews([]);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create package:", err);
      setError(
        err?.data?.message || err?.message || "Failed to create package"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-red-500">
            List Travel Package
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex justify-between items-start">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* COVER IMAGE UPLOAD */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Cover Image
              </label>

              <div className="w-full h-40 border border-gray-300 rounded flex items-center justify-center overflow-hidden bg-gray-50 relative">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-3xl">
                    <FaCamera />
                  </span>
                )}
              </div>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleCoverChange}
                className="hidden"
                id="cover-upload"
                disabled={isLoading}
              />

              <label
                htmlFor="cover-upload"
                className="cursor-pointer mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 block text-center"
              >
                Upload Cover Image
              </label>
            </div>

            {/* MULTIPLE IMAGES */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Package Images (Max 5) - Optional
              </label>

              <div className="grid grid-cols-5 gap-3 mb-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square border border-gray-200 bg-gray-50 rounded flex items-center justify-center overflow-hidden relative"
                  >
                    {imagePreviews[index] ? (
                      <>
                        <img
                          src={imagePreviews[index]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-300 text-2xl">
                        <FaCamera />
                      </span>
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
                accept="image/jpeg,image/jpg,image/png,image/webp"
                disabled={isLoading}
              />

              <label
                htmlFor="image-upload"
                className="cursor-pointer px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 block text-center"
              >
                {formData.images.length >= 5
                  ? "Maximum images reached"
                  : "Add Images"}
              </label>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Package Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Price per person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="1399.99"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Brief overview"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                rows={2}
                required
                disabled={isLoading}
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Duration Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="3"
                  value={formData.durationDays}
                  onChange={(e) =>
                    setFormData({ ...formData, durationDays: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Duration Nights <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="2"
                  value={formData.durationNights}
                  onChange={(e) =>
                    setFormData({ ...formData, durationNights: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Booking Lead Time & Default Departure Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Booking Lead Time
                </label>
                <input
                  type="number"
                  placeholder="24"
                  value={formData.bookingLeadHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bookingLeadHours: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum hours before departures to allow booking
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Default Departure Capacity
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={formData.defaultDepartureCapacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultDepartureCapacity: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Default capacity for new departures
                </p>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Whats Included
              </label>
              <div className="space-y-2">
                {formData.included.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Accommodation"
                      value={item}
                      onChange={(e) => {
                        const newIncluded = [...formData.included];
                        newIncluded[index] = e.target.value;
                        setFormData({ ...formData, included: newIncluded });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newIncluded = formData.included.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, included: newIncluded });
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      included: [...formData.included, ""],
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  disabled={isLoading}
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* What's Not Included */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Whats Not Included
              </label>
              <div className="space-y-2">
                {formData.notIncluded.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Flights"
                      value={item}
                      onChange={(e) => {
                        const newNotIncluded = [...formData.notIncluded];
                        newNotIncluded[index] = e.target.value;
                        setFormData({
                          ...formData,
                          notIncluded: newNotIncluded,
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newNotIncluded = formData.notIncluded.filter(
                          (_, i) => i !== index
                        );
                        setFormData({
                          ...formData,
                          notIncluded: newNotIncluded,
                        });
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      notIncluded: [...formData.notIncluded, ""],
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  disabled={isLoading}
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Destinations */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Destinations
              </label>
              <div className="space-y-2">
                {formData.destinations.map((dest, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., pokhara (ID or slug)"
                      value={dest}
                      onChange={(e) => {
                        const newDestinations = [...formData.destinations];
                        newDestinations[index] = e.target.value;
                        setFormData({
                          ...formData,
                          destinations: newDestinations,
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newDestinations = formData.destinations.filter(
                          (_, i) => i !== index
                        );
                        setFormData({
                          ...formData,
                          destinations: newDestinations,
                        });
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      destinations: [...formData.destinations, ""],
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  disabled={isLoading}
                >
                  + Add Destination
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "List Package"}
          </button>
        </div>
      </div>
    </div>
  );
};

CreatePackageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CreatePackageModal;
