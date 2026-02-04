import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCamera } from "react-icons/fa";
import { useUpdateTravelPackageMutation } from "../../../Services/travelPackageApiSlice";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UpdatePackageModal = ({ isOpen, onClose, packageData, onSuccess }) => {
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
    images: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [updateTravelPackage, { isLoading }] = useUpdateTravelPackageMutation();
  const [error, setError] = useState("");

  // Populate form when packageData changes
  useEffect(() => {
    if (packageData) {
      setFormData({
        name: packageData.name || "",
        description: packageData.description || "",
        price: packageData.price || "",
        durationDays: packageData.durationDays || "",
        durationNights: packageData.durationNights || "",
        included: packageData.included || [],
        notIncluded: packageData.notIncluded || [],
        destinations: packageData.destinations || [],
        bookingLeadHours: packageData.bookingLeadHours || "",
        defaultDepartureCapacity: packageData.defaultDepartureCapacity || "",
        images: []
      });

      // Set existing images
      if (packageData.images && packageData.images.length > 0) {
        setExistingImages(packageData.images);
      } else if (packageData.imagesUrls && packageData.imagesUrls.length > 0) {
        setExistingImages(packageData.imagesUrls);
      }
      
      setNewImagePreviews([]);
    }
  }, [packageData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + formData.images.length + files.length;
    
    if (totalImages > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    // Create preview URLs for new images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    
    setFormData({ ...formData, images: [...formData.images, ...files] });
    setNewImagePreviews([...newImagePreviews, ...newPreviews]);
    setError("");
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = newImagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreviews[index]);
    
    setFormData({ ...formData, images: newImages });
    setNewImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!packageData?.slug) {
      setError("Package slug not found");
      return;
    }

    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.durationDays || !formData.durationNights) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      // Prepare FormData
      const submitData = new FormData();
      
      // Append basic fields
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('price', formData.price);
      submitData.append('durationDays', Number(formData.durationDays));
      submitData.append('durationNights', Number(formData.durationNights));
      
      // Append optional fields
      if (formData.bookingLeadHours) {
        submitData.append('bookingLeadHours', Number(formData.bookingLeadHours));
      }
      if (formData.defaultDepartureCapacity) {
        submitData.append('defaultDepartureCapacity', Number(formData.defaultDepartureCapacity));
      }
      
      // Append arrays as JSON strings
      if (formData.included.length > 0) {
        submitData.append('included', JSON.stringify(formData.included));
      }
      if (formData.notIncluded.length > 0) {
        submitData.append('notIncluded', JSON.stringify(formData.notIncluded));
      }
      if (formData.destinations.length > 0) {
        submitData.append('destinations', JSON.stringify(formData.destinations));
      }
      
      // Append existing images that weren't removed
      if (existingImages.length > 0) {
        submitData.append('existingImages', JSON.stringify(existingImages));
      }
      
      // Append new images
      formData.images.forEach((image) => {
        submitData.append('images', image);
      });

      await updateTravelPackage({ 
        slug: packageData.slug, 
        data: submitData 
      }).unwrap();
      
      // Cleanup preview URLs
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update package:", err);
      setError(err?.data?.message || err?.message || "Failed to update package");
    }
  };

  const allImages = [
    ...existingImages.map((url, idx) => ({ 
      url: url.startsWith('http') ? url : `${API_BASE_URL}${url}`, 
      type: 'existing', 
      index: idx 
    })),
    ...newImagePreviews.map((url, idx) => ({ 
      url, 
      type: 'new', 
      index: idx 
    }))
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-red-500">
            Update Travel Package
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
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

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Image Section */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Package Images (Max 5) - {allImages.length}/5
              </label>
              <div className="grid grid-cols-5 gap-3 mb-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square border border-gray-200 bg-gray-50 rounded flex items-center justify-center overflow-hidden relative"
                  >
                    {allImages[index] ? (
                      <>
                        <img
                          src={allImages[index].url}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (allImages[index].type === 'existing') {
                              removeExistingImage(allImages[index].index);
                            } else {
                              removeNewImage(allImages[index].index);
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          disabled={isLoading}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-300 text-2xl"><FaCamera /></span>
                    )}
                  </div>
                ))}
              </div>

              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload-update"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                disabled={isLoading || allImages.length >= 5}
              />

              <label
                htmlFor="image-upload-update"
                className={`cursor-pointer px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 block text-center ${
                  isLoading || allImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {allImages.length >= 5 ? 'Maximum images reached' : 'Add Images'}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: JPEG, PNG, WebP (Max 5 images)
              </p>
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
                    setFormData({ ...formData, bookingLeadHours: e.target.value })
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
                    setFormData({ ...formData, defaultDepartureCapacity: e.target.value })
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
                        const newIncluded = formData.included.filter((_, i) => i !== index);
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
                  onClick={() => setFormData({ ...formData, included: [...formData.included, ''] })}
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
                        setFormData({ ...formData, notIncluded: newNotIncluded });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newNotIncluded = formData.notIncluded.filter((_, i) => i !== index);
                        setFormData({ ...formData, notIncluded: newNotIncluded });
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
                  onClick={() => setFormData({ ...formData, notIncluded: [...formData.notIncluded, ''] })}
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
                        setFormData({ ...formData, destinations: newDestinations });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newDestinations = formData.destinations.filter((_, i) => i !== index);
                        setFormData({ ...formData, destinations: newDestinations });
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
                  onClick={() => setFormData({ ...formData, destinations: [...formData.destinations, ''] })}
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
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Package"}
          </button>
        </div>
      </div>
    </div>
  );
};

UpdatePackageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default UpdatePackageModal;