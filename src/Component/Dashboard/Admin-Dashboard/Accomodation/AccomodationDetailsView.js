import { useState } from "react";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AccommodationDetailsView = ({ accommodation, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "rooms", label: `Rooms (${accommodation.rooms?.length || 0})` },
    { id: "bookings", label: "Bookings" },
    { id: "settings", label: "Settings" },
  ];

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

          {/* Title and Address */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {accommodation.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <FaMapMarkerAlt size={12} className="text-gray-500" />
              <span>{accommodation.address}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex border py-1 border-gray-300 bg-gray-200 gap-2 rounded-md overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
      <div className="mi mx-auto px-6 py-6">
        {activeTab === "overview" && (
          <OverviewTab accommodation={accommodation} />
        )}
        {activeTab === "rooms" && <RoomsTab accommodation={accommodation} />}
        {activeTab === "bookings" && (
          <BookingsTab accommodation={accommodation} />
        )}
        {activeTab === "settings" && (
          <SettingsTab accommodation={accommodation} />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ accommodation }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Property Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Details
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Description
            </h3>
            <p className="text-sm text-gray-600">
              {accommodation.description || "No description available"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Check-in/out
            </h3>
            <p className="text-sm text-gray-600">
              Check-in: {accommodation.checkInTime || "14:00"} | Check-out:{" "}
              {accommodation.checkOutTime || "11:00"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Stay Requirements
            </h3>
            <p className="text-sm text-gray-600">
              Min: {accommodation.minNights || 2} nights | Max:{" "}
              {accommodation.maxNights || 14} nights
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              House Rules
            </h3>
            <p className="text-sm text-gray-600">
              {accommodation.houseRules ||
                "No smoking, No pets, Quiet hours 10 PM - 7 AM"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Contact Note
            </h3>
            <p className="text-sm text-gray-600">
              {accommodation.contactNote || "Call for special arrangements"}
            </p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Amenities
          </h2>
          {accommodation.amenities && accommodation.amenities.length > 0 ? (
            <ul className="grid grid-cols-2 gap-2">
              {accommodation.amenities.map((amenity, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {amenity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              No amenities listed for this property.
            </p>
          )}
        </div>

        {/* Destinations */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Destinations
          </h2>
          {accommodation.destinations &&
          accommodation.destinations.length > 0 ? (
            <ul className="space-y-2">
              {accommodation.destinations.map((dest, index) => (
                <li
                  key={index}
                  className="text-sm inline-block text-gray-700 border border-gray-400 rounded-full px-3 py-1 bg-gray-50 hover:bg-gray-100 transition"
                >
                  {dest}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              No destinations added for this property.
            </p>
          )}
        </div>
      </div>

      {/* Pricing & Fees */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pricing & Fees
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Cleaning Fee
            </span>
            <span className="text-sm text-gray-900">
              NPR {accommodation.cleaningFee || 500}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Service Fee
            </span>
            <span className="text-sm text-gray-900">
              {accommodation.serviceFee || "10"}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Tax Rate</span>
            <span className="text-sm text-gray-900">
              {accommodation.taxRate || "13"}%
            </span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">
                Price per Night
              </span>
              <span className="text-lg font-bold text-gray-900">
                Rs. {accommodation.pricePerNight}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      {accommodation.images && accommodation.images.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accommodation.images.map((img, idx) => (
              <img
                key={idx}
                src={`${API_BASE_URL}${img}`}
                alt={`${accommodation.name} ${idx + 1}`}
                className="w-full h-32 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Rooms Tab Component
const RoomsTab = ({ accommodation }) => {
  const rooms = accommodation.rooms || [];

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No rooms added yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {room.name}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Type:</span> {room.type}
            </p>
            <p>
              <span className="font-medium">Capacity:</span> {room.capacity}{" "}
              guests
            </p>
            <p>
              <span className="font-medium">Beds:</span> {room.beds}
            </p>
            <p>
              <span className="font-medium">Price:</span> Rs. {room.price}/night
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Bookings Tab Component
const BookingsTab = ({ accommodation }) => {
  const bookings = accommodation.bookings || [];

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-900 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-3">Guest Name</th>
            <th className="px-6 py-3">Check-in</th>
            <th className="px-6 py-3">Check-out</th>
            <th className="px-6 py-3">Guests</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{booking.guestName}</td>
              <td className="px-6 py-4">{booking.checkIn}</td>
              <td className="px-6 py-4">{booking.checkOut}</td>
              <td className="px-6 py-4">{booking.guests}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4">Rs. {booking.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ accommodation }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
            defaultValue={accommodation.status}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Max Guests
          </label>
          <input
            type="number"
            className="mt-1 block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
            defaultValue={accommodation.maxGuests}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Featured</label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                defaultChecked={accommodation.featured}
              />
              <span className="ml-2 text-sm text-gray-600">
                Mark as featured property
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetailsView;
