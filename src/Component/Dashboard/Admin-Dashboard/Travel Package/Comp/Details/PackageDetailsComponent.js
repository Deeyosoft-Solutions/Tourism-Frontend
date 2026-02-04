import { useState } from "react";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { Clock, Users, Calendar } from "lucide-react";
import PackageDetailsTab from "./Tab Component/PackageDetails";
import ReviewsTab from "./Tab Component/ReviewsTab";
import BookingTab from "./Tab Component/BookingTab";
import DeparturesTab from "./Tab Component/DeparturesTab";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PackageDetailsComponent = ({
  selectedPackage,
  handleToggleDepartures,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("departure");

  const tabs = [
    { id: "departure", label: "Departure", component: DeparturesTab },
    { id: "details", label: "Package Details", component: PackageDetailsTab },
    { id: "booking", label: "Booking", component: BookingTab },
    { id: "reviews", label: "Reviews", component: ReviewsTab },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const ActiveTabComponent = tabs.find(
    (tab) => tab.id === activeTab
  )?.component;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          {/* Go Back Button */}
          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 transition">
            <button
              onClick={onClose}
              className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition"
            >
              <FaArrowLeft size={14} /> Go Back
            </button>
          </div>

          {/* Package Info Header */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Package Image */}
            <div className="flex-shrink-0">
              {selectedPackage.images?.[0] ? (
                <img
                  src={`${API_BASE_URL}${selectedPackage.images[0]}`}
                  alt={selectedPackage.name}
                  className="w-full lg:w-48 h-48 rounded-lg object-cover shadow-md"
                  onError={(e) => {
                    e.target.src = "/assets/no-image.png";
                  }}
                />
              ) : (
                <div className="w-full lg:w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Package Info */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedPackage.name}
              </h1>

              {/* Destination */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <FaMapMarkerAlt size={12} className="text-gray-500" />
                <span>
                  {selectedPackage.destinationsRelation?.[0]?.name || "N/A"}
                </span>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-base">₹</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Price</p>
                    <p className="font-semibold text-sm text-gray-900">
                      Rs. {Number(selectedPackage.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Calendar size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {selectedPackage.duration || "5"}D /{" "}
                      {(selectedPackage.duration || 5) - 1}N
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Capacity</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {selectedPackage.capacity || "20"} People
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <Clock size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Lead Time</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {selectedPackage.bookingLeadHours || 0}h
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-3">
                <div className="flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      selectedPackage.usesDepartures
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  Departures:{" "}
                  {selectedPackage.usesDepartures ? "Scheduled" : "On Demand"}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex border py-1 border-gray-300 bg-gray-200 gap-2 rounded-md overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 py-1 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gray-100 text-gray-900 shadow-gray shadow-md rounded-lg"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-lg"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            {ActiveTabComponent && (
              <ActiveTabComponent
                packageSlug={selectedPackage.slug}
                packageData={selectedPackage}
                handleToggleDepartures={handleToggleDepartures}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsComponent;