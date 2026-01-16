import { useState } from "react";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import OverviewTab from './Accommodation Details/Overview';
import RoomsTab from './Accommodation Details/Rooms Tab';
import BookingsTab from './Accommodation Details/Bookings Tab';
import SettingsTab from './Accommodation Details/Settings Tab';
import RoomUnitsTab from './Accommodation Details/Rooms Unit Tab';
import UnitAllocationTab from "./Accommodation Details/Unit Allocation Tab";
import BookingDetailsTab from "./Accommodation Details/Booking Details Tab";
import { useGetBookingsByAccommodationIdQuery } from "../../../../Services/accommodationBooking";
import { useGetRoomsQuery } from "../../../../Services/accommodationRoomApiSlice";

const AccommodationDetailsView = ({ accommodation, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState(null); 

  // Fetch bookings
  const { data: allBookings } = useGetBookingsByAccommodationIdQuery(accommodation.id);
  
  // Fetch rooms for overview tab
  const { data: roomsData, isLoading: roomsLoading, error: roomsError } = useGetRoomsQuery(accommodation.slug || accommodation.id);
  
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "rooms", label: "Rooms"},
    { id: "bookings", label: "Bookings" },
    { id: "settings", label: "Settings" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Clear selected room and booking when switching tabs
    if (tabId !== "rooms") {
      setSelectedRoom(null);
      setViewMode(null);
    }
    if (tabId !== "bookings") {
      setSelectedBooking(null);
    }
  };

  const handleViewRoomUnits = (room) => {
    setSelectedRoom(room);
    setViewMode("units");
  };

  const handleViewCalendar = (room) => {
    setSelectedRoom(room);
    setViewMode("calendar");
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setViewMode(null);
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBackToBookings = () => {
    setSelectedBooking(null);
  };

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
      <div className="mi mx-auto px-6 py-6">
        {!selectedRoom && !selectedBooking ? (
          <>
            {activeTab === "overview" && (
              <OverviewTab 
                accommodation={accommodation} 
                rooms={roomsData?.data || []}
                roomsLoading={roomsLoading}
                roomsError={roomsError}
              />
            )}
            {activeTab === "rooms" && (
              <RoomsTab
                accommodation={accommodation}
                onViewRoomUnits={handleViewRoomUnits}
                onViewCalendar={handleViewCalendar}
              />
            )}
            {activeTab === "bookings" && (
              <BookingsTab 
                accommodation={allBookings}
                onViewBookingDetails={handleViewBookingDetails}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab accommodation={accommodation} />
            )}
          </>
        ) : (
          <>
            {viewMode === "units" && (
              <RoomUnitsTab room={selectedRoom} onBack={handleBackToRooms} />
            )}
            {viewMode === "calendar" && (
              <UnitAllocationTab room={selectedRoom} onBack={handleBackToRooms} />
            )}
            {selectedBooking && (
              <BookingDetailsTab 
                booking={selectedBooking} 
                onBack={handleBackToBookings}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AccommodationDetailsView;