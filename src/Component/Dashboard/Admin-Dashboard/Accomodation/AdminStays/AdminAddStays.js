import { useState } from "react";
import { FaTimes, FaCheck, FaArrowRight } from "react-icons/fa";
import { useGetAccomodationCategoriesQuery } from "../../../../../Services/accomodationCategoryApiSlice";
import { useAddAccommodationMutation } from "../../../../../Services/accomodationApiSlice";

const ForAdminAddStay = ({ onClose, onAdded }) => {
  const [addAccommodation, { isLoading }] = useAddAccommodationMutation();
  const { data: categoriesData } = useGetAccomodationCategoriesQuery();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    categoryId: "",
    checkInFrom: "10:00 AM",
    checkOutUntil: "12:00 PM",
    primaryDestinationId: "",
    lat: "",
    lng: "",
    cleaningFee: "",
    serviceFeePct: "",
    taxPct: "",
    minNights: "",
    maxNights: "",
    houseRules: "",
    contactNote: "",
    amenities: [],
    destinations: [],
    images: [],
    published: false,
  });

  const [error, setError] = useState("");
  const categories = categoriesData?.data || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages(imageUrls);

    // also store the actual File objects
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !formData.name ||
        !formData.description ||
        !formData.address ||
        !formData.primaryDestinationId
      ) {
        setError("Please fill all required fields.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.minNights || !formData.maxNights) {
        setError("Please fill all required fields.");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.images) {
        setError("Please fill all required fields.");
        return;
      }
    }
    setError("");
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.address ||
      !formData.primaryDestinationId ||
      !formData.minNights ||
      !formData.maxNights
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (
      !formData.images ||
      formData.images.length < 1 ||
      formData.images.length > 10
    ) {
      setError("Please upload between 1 and 10 images.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "images") {
          formData.images.forEach((file) => {
            formDataToSend.append("images", file);
          });
        } else if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      await addAccommodation(formDataToSend).unwrap();
      console.log("Form data:", formDataToSend);
      onAdded();
      onClose();
    } catch (err) {
      console.error("Failed to add accommodation:", err);
      setError("Failed to add accommodation. Please try again.");
    }
  };

  const steps = [
    { number: 1, label: "Basic Information" },
    { number: 2, label: "Policies & Fees" },
    { number: 3, label: "Media & Amenities" },
    { number: 4, label: "Review & Publish" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            List Accommodation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-gray-50">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                    currentStep > step.number
                      ? "bg-red-500 text-white"
                      : currentStep === step.number
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {currentStep > step.number ? (
                    <FaCheck size={14} />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    currentStep >= step.number
                      ? "text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <FaArrowRight size={24} color="grey" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Property Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Accommodation type</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Destination ID *
                  </label>
                  <input
                    type="text"
                    name="primaryDestinationId"
                    value={formData.primaryDestinationId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Select destination"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="City, Area"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check in from
                  </label>
                  <input
                    type="text"
                    name="checkInFrom"
                    value={formData.checkInFrom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="02:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check out until
                  </label>
                  <input
                    type="text"
                    name="checkOutUntil"
                    value={formData.checkOutUntil}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="11:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Brief overview"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Note
                  </label>
                  <textarea
                    name="contactNote"
                    value={formData.contactNote}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Special instruction for guests"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Location on map
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 h-24 flex items-center justify-center text-gray-400">
                    Select location
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="number"
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      step="any"
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      step="any"
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Longitude"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Policies & Fees */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Nights *
                  </label>
                  <input
                    type="number"
                    name="minNights"
                    value={formData.minNights}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Nights *
                  </label>
                  <input
                    type="number"
                    name="maxNights"
                    value={formData.maxNights}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleaning Fee (Rs.)
                  </label>
                  <input
                    type="number"
                    name="cleaningFee"
                    value={formData.cleaningFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Fee (%)
                  </label>
                  <input
                    type="number"
                    name="serviceFeePct"
                    value={formData.serviceFeePct}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    name="taxPct"
                    value={formData.taxPct}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="13"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Rules
                </label>
                <textarea
                  name="houseRules"
                  value={formData.houseRules}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="No smoking, No pets, etc."
                />
              </div>
            </div>
          )}

          {/* Step 3: Media & Amenities */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="border border-gray-300 rounded-lg p-4 min-h-32">
                  <p className="text-gray-400 text-sm">
                    Select amenities (WiFi, Parking, Pool, etc.)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Destinations
                </label>
                <div className="border border-gray-300 rounded-lg p-4 min-h-24">
                  <p className="text-gray-400 text-sm">
                    Add related destination IDs
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (1-10 images required)
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageChange} // 👈 important
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-gray-500"
                  >
                    <div className="text-4xl mb-2">📷</div>
                    <p>Click to upload images</p>
                    <p className="text-sm text-gray-400 mt-1">
                      1-10 images required
                    </p>
                  </label>
                </div>

                {/* Preview section */}
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="h-20 w-full bg-gray-200 rounded flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`upload-${idx}`}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Publish accommodation immediately *
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Review & Publish */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm font-medium">
                  Please review all information before submitting
                </p>
              </div>

              {/* Basic Information Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Property Name</p>
                    <p className="font-medium text-gray-800">
                      {formData.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Category</p>
                    <p className="font-medium text-gray-800">
                      {categories?.find((cat) => cat.id === formData.categoryId)
                        ?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-800">
                      {formData.address || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Primary Destination ID</p>
                    <p className="font-medium text-gray-800">
                      {formData.primaryDestinationId || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Check-in Time</p>
                    <p className="font-medium text-gray-800">
                      {formData.checkInFrom || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Check-out Time</p>
                    <p className="font-medium text-gray-800">
                      {formData.checkOutUntil || "—"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Description</p>
                    <p className="font-medium text-gray-800">
                      {formData.description || "—"}
                    </p>
                  </div>
                  {formData.contactNote && (
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">Contact Note</p>
                      <p className="font-medium text-gray-800">
                        {formData.contactNote}
                      </p>
                    </div>
                  )}
                  {(formData.lat || formData.lng) && (
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-800">
                        Lat: {formData.lat || "—"}, Lng: {formData.lng || "—"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Policies & Fees Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm mr-3">
                    2
                  </span>
                  Policies & Fees
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Min Nights</p>
                    <p className="font-medium text-gray-800">
                      {formData.minNights
                        ? `${formData.minNights} nights`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Max Nights</p>
                    <p className="font-medium text-gray-800">
                      {formData.maxNights
                        ? `${formData.maxNights} nights`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Cleaning Fee</p>
                    <p className="font-medium text-gray-800">
                      {formData.cleaningFee
                        ? `Rs. ${formData.cleaningFee}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Service Fee</p>
                    <p className="font-medium text-gray-800">
                      {formData.serviceFeePct
                        ? `${formData.serviceFeePct}%`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Tax</p>
                    <p className="font-medium text-gray-800">
                      {formData.taxPct ? `${formData.taxPct}%` : "—"}
                    </p>
                  </div>
                  {formData.houseRules && (
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">House Rules</p>
                      <p className="font-medium text-gray-800">
                        {formData.houseRules}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Media & Amenities Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm mr-3">
                    3
                  </span>
                  Media & Amenities
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Amenities</p>
                    <p className="font-medium text-gray-800">
                      {formData.amenities?.length > 0
                        ? formData.amenities.join(", ")
                        : "No amenities selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Destinations</p>
                    <p className="font-medium text-gray-800">
                      {formData.destinations?.length > 0
                        ? formData.destinations.join(", ")
                        : "No additional destinations"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Images</p>
                    <p className="font-medium text-gray-800">
                      {formData.images?.length > 0
                        ? `${formData.images.length} image(s) uploaded`
                        : "No images uploaded"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Publish Status</p>
                    <p className="font-medium text-gray-800">
                      {formData.published
                        ? "✓ Will be published immediately"
                        : "Will remain as draft"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForAdminAddStay;
