import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const UpdatePackageModal = ({ isOpen, onClose, packageData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationDays: "",
    durationNights: "",
    imagesUrls: [],
    included: [],
    notIncluded: [],
    destinations: [],
    bookingLeadHours: "",
    defaultDepartureCapacity: "",
    coverImage: null,
    images: []
  });

  // Populate form when packageData changes
  useEffect(() => {
    if (packageData) {
      setFormData({
        name: packageData.name || "",
        description: packageData.description || "",
        price: packageData.price || "",
        durationDays: packageData.durationDays || "",
        durationNights: packageData.durationNights || "",
        imagesUrls: packageData.imagesUrls || [],
        included: packageData.included || [],
        notIncluded: packageData.notIncluded || [],
        destinations: packageData.destinations || [],
        bookingLeadHours: packageData.bookingLeadHours || "",
        defaultDepartureCapacity: packageData.defaultDepartureCapacity || "",
        coverImage: packageData.coverImage || null,
        images: packageData.images || []
      });
    }
  }, [packageData]);

  const handleSubmit = () => {
    if (!packageData?.slug) return;

    try {
      // Convert string numbers to actual numbers
      const submitData = {
        slug: packageData.slug,
        ...formData,
        durationDays: formData.durationDays ? Number(formData.durationDays) : undefined,
        durationNights: formData.durationNights ? Number(formData.durationNights) : undefined,
        bookingLeadHours: formData.bookingLeadHours ? Number(formData.bookingLeadHours) : undefined,
        defaultDepartureCapacity: formData.defaultDepartureCapacity ? Number(formData.defaultDepartureCapacity) : undefined,
      };
      console.log("Updating:", submitData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update package:", err);
    }
  };

  const handleArrayInput = (field, value) => {
    setFormData({
      ...formData,
      [field]: value.split(",").map((v) => v.trim()).filter(v => v)
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: files, imagesUrls: [...formData.imagesUrls, ...urls].slice(0, 5) });
  };

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
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Image Section */}
            <div>
              <div className="grid grid-cols-5 gap-3 mb-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square border border-gray-200 bg-gray-50 rounded flex items-center justify-center overflow-hidden"
                  >
                    {formData.imagesUrls[index] ? (
                      <img
                        src={formData.imagesUrls[index]}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-300 text-2xl">📷</span>
                    )}
                  </div>
                ))}
              </div>

              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload-update"
                accept="image/*"
              />

              <label
                htmlFor="image-upload-update"
                className="cursor-pointer px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 block text-center"
              >
                Add Images
              </label>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Package Name
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
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Price per person
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
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Description
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
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Duration Days
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
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Duration Nights
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
              <input
                type="text"
                placeholder="Accomodation, Breakfast"
                value={formData.included.join(", ")}
                onChange={(e) => handleArrayInput("included", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* What's Not Included */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Whats Not Included
              </label>
              <input
                type="text"
                placeholder="Flights, Personal Expense"
                value={formData.notIncluded.join(", ")}
                onChange={(e) => handleArrayInput("notIncluded", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Destinations */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Destinations
              </label>
              <input
                type="text"
                placeholder="pokhara, chitwan (comma separated IDs or slugs)"
                value={formData.destinations.join(", ")}
                onChange={(e) => handleArrayInput("destinations", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Update Package
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