import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, X, Trash2, Users, Bed, Bath } from "lucide-react";
import { useGetAccommodationBySlugQuery } from "../../../Services/accomodationApiSlice";
import { useGetRoomsQuery } from "../../../Services/accommodationRoomApiSlice";
import { useCreateRoomBookingMutation } from "../../../Services/accommodationBooking";
import LoadingSpinner from "../../../Component/LoadingSpinner";
import ErrorMessage from "../../../Component/ErrorMessage";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// Date Range Calendar Component
const DateRangeCalendar = ({ checkIn, checkOut, onCheckInChange, onCheckOutChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const generateCalendarDays = (date) => {
    const days = [];
    const totalDays = daysInMonth(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Current month days only - no padding
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }
    
    return days;
  };
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const isDateInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const d = formatDate(date);
    return d > checkIn && d < checkOut;
  };
  
  const isStartDate = (date) => {
    return formatDate(date) === checkIn;
  };
  
  const isEndDate = (date) => {
    return formatDate(date) === checkOut;
  };
  
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const handleDateClick = (date) => {
    if (isPastDate(date)) return;
    
    const formattedDate = formatDate(date);
    
    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange(formattedDate);
      onCheckOutChange("");
    } else if (checkIn && !checkOut) {
      if (formattedDate > checkIn) {
        onCheckOutChange(formattedDate);
      } else {
        onCheckInChange(formattedDate);
        onCheckOutChange("");
      }
    }
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const days1 = generateCalendarDays(currentMonth);
  const month2 = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  const days2 = generateCalendarDays(month2);
  
  const firstDayOfMonth1 = firstDayOfMonth(currentMonth);
  const firstDayOfMonth2 = firstDayOfMonth(month2);
  
  return (
    <div className="border rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium">Select Dates</h4>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {[
          { days: days1, date: currentMonth, offset: firstDayOfMonth1 }, 
          { days: days2, date: month2, offset: firstDayOfMonth2 }
        ].map((cal, idx) => (
          <div key={idx}>
            <h3 className="text-center font-medium mb-3">
              {monthNames[cal.date.getMonth()]} {cal.date.getFullYear()}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-gray-500 font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: cal.offset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {/* Actual days */}
              {cal.days.map((d, i) => {
                const isStart = isStartDate(d.date);
                const isEnd = isEndDate(d.date);
                const isInRange = isDateInRange(d.date);
                const isPast = isPastDate(d.date);
                
                return (
                  <button
                    key={i}
                    onClick={() => handleDateClick(d.date)}
                    disabled={isPast}
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-full
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                      ${isStart || isEnd ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                      ${isInRange ? 'bg-red-100 text-red-700' : ''}
                      ${!isPast && !isStart && !isEnd && !isInRange ? 'text-gray-900' : ''}
                    `}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AccommodationPage = () => {
  const { slug } = useParams();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const { data, error, isLoading, refetch } =
    useGetAccommodationBySlugQuery(slug);
  const {
    data: roomsData,
    isLoading: roomsLoading,
    error: roomsError,
  } = useGetRoomsQuery(slug);

  const [createBooking, { isLoading: isBooking }] = useCreateRoomBookingMutation();

  if (isLoading) {
    return (
      <p className="text-center text-gray-500">
        <LoadingSpinner />
      </p>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error?.message || "Internal server error"}
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 p-4">
        No accommodation found.
      </div>
    );
  }

  const {
    id: accommodationId,
    name,
    description,
    address,
    minNights,
    maxNights,
    amenities,
    images,
    checkInFrom,
    checkOutUntil,
    houseRules,
  } = data;
  
  // ✅ Filter rooms to show only published ones
  const allRooms = roomsData?.data || [];
  const rooms = allRooms.filter(room => room.published === true);

  const handleNextStep = () => {
    setShowModal(true);
  };

  const handleRoomSelect = (room) => {
    // ✅ Check if room is active before allowing selection
    if (room.status !== 'active') {
      return; // Don't allow selection if room is inactive or under maintenance
    }
    
    const existingRoom = selectedRooms.find(r => r.id === room.id);
    
    if (existingRoom) {
      // Room already selected, remove it
      setSelectedRooms(selectedRooms.filter(r => r.id !== room.id));
    } else {
      // Add new room with quantity 1
      setSelectedRooms([...selectedRooms, { ...room, quantity: 1 }]);
    }
  };

  const handleRoomQuantityChange = (roomId, change) => {
    setSelectedRooms(selectedRooms.map(room => {
      if (room.id === roomId) {
        const newQty = room.quantity + change;
        if (newQty >= 1 && newQty <= (room.availableUnits || 8)) {
          return { ...room, quantity: newQty };
        }
      }
      return room;
    }));
  };

  const handleRemoveRoom = (roomId) => {
    setSelectedRooms(selectedRooms.filter(r => r.id !== roomId));
  };

  const isRoomSelected = (roomId) => {
    return selectedRooms.some(r => r.id === roomId);
  };

  const handleConfirmBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (selectedRooms.length === 0) {
      alert("Please select at least one room");
      return;
    }

    try {
      // Create a booking for each selected room
      const bookingPromises = selectedRooms.map(room => {
        const bookingData = {
          accommodationId,
          roomId: room.id,
          checkIn,
          checkOut,
          qty: room.quantity,
          guests: parseInt(numberOfGuests),
        };
        return createBooking(bookingData).unwrap();
      });

      await Promise.all(bookingPromises);
      alert("All bookings confirmed successfully!");
      setShowModal(false);
      // Reset form
      setSelectedRooms([]);
      setNumberOfGuests(1);
      setCheckIn("");
      setCheckOut("");
    } catch (err) {
      alert(err?.data?.message || "Failed to create booking");
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || selectedRooms.length === 0) return {
      roomTotal: 0,
      serviceFee: 0,
      tax: 0,
      total: 0,
      nights: 0,
    };
    
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    
    const roomTotal = selectedRooms.reduce((sum, room) => {
      return sum + (room.basePrice * nights * room.quantity);
    }, 0);
    
    const serviceFee = roomTotal * 0.1;
    const tax = roomTotal * 0.13;
    
    return {
      roomTotal,
      serviceFee,
      tax,
      total: roomTotal + serviceFee + tax,
      nights,
    };
  };

  const getTotalCapacity = () => {
    return selectedRooms.reduce((sum, room) => sum + (room.capacity * room.quantity), 0);
  };

  const totals = calculateTotal();
  const maxGuests = getTotalCapacity() || 10;

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative w-full h-96">
        <img
          src={
            images?.[0]
              ? `${API_BASE_URL}${images[0]}`
              : "/api/placeholder/1200/400"
          }
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
          <h1 className="text-3xl md:text-4xl text-white font-bold">{name}</h1>
          <p className="text-white mt-1">{address}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* About this property */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">About this property</h2>
            <p className="text-gray-700">{description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            {amenities && amenities.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((item, i) => (
                  <div key={i} className="text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed</p>
            )}
          </div>

          {/* Check-in Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Check-in Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Check-in</p>
                  <p className="font-medium">{checkInFrom || "13:00"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-out</p>
                  <p className="font-medium">{checkOutUntil || "11:00"}</p>
                </div>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <div>
                  <p className="text-gray-600 text-sm">Min Stay</p>
                  <p className="font-medium">{minNights} night</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Max Stay</p>
                  <p className="font-medium">{maxNights} nights</p>
                </div>
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">House Rules</h2>
            <p className="text-gray-700">
              {houseRules || "No smoking, No parties, Respect quiet hours"}
            </p>
          </div>
        </div>

        {/* Choose Your Rooms Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Choose Your Rooms
          </h2>

          {roomsLoading ? (
            <div className="text-center py-8">
              <LoadingSpinner />
            </div>
          ) : roomsError ? (
            <div className="text-center py-8 text-red-500">
              Error loading rooms
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No rooms available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const isInactive = room.status === 'inactive';
                const isMaintenance = room.status === 'maintenance';
                const isNotActive = isInactive || isMaintenance;
                const isSelected = isRoomSelected(room.id);
                
                return (
                  <div
                    key={room.id}
                    className={`border rounded-xl overflow-hidden bg-white transition ${
                      isNotActive 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:shadow-md cursor-pointer'
                    } ${
                      isSelected ? "ring-2 ring-red-500" : ""
                    }`}
                    onClick={() => handleRoomSelect(room)}
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={
                          room.images?.[0]
                            ? `${API_BASE_URL}${room.images[0]}`
                            : "/public/assets/Images/house0.jpg"
                        }
                        alt={room.name}
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Status Badge */}
                      {isNotActive && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {isMaintenance ? 'Under Maintenance' : 'Unavailable'}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Title & Price */}
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            NPR {room.basePrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                      </div>

                      {/* Room Meta */}
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users color="#000" size={18} /> {room.capacity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed color="#000" size={18} /> {room.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath color="#000" size={18} /> {room.bathrooms}
                        </span>
                      </div>

                      {/* Status Message */}
                      {isNotActive && (
                        <div className={`text-sm font-medium p-2 rounded ${
                          isMaintenance 
                            ? 'bg-yellow-50 text-yellow-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isMaintenance 
                            ? '🔧 This room is currently under maintenance and cannot be booked.' 
                            : '⚠️ This room is currently unavailable for booking.'}
                        </div>
                      )}

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-2">
                        {room.amenities?.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {a}
                          </span>
                        ))}
                        {room.amenities?.length > 3 && (
                          <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Availability */}
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-500">
                          {room.totalUnits || 0} available
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map goes here</p>
          </div>
        </div>
      </div>

      {/* Next Step Button (Fixed Bottom Right) */}
      {selectedRooms.length > 0 && (
        <button
          onClick={handleNextStep}
          className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition flex items-center gap-2 z-40"
        >
          Next Step ({selectedRooms.length} {selectedRooms.length === 1 ? 'room' : 'rooms'})
          <ChevronRight size={20} />
        </button>
      )}

      {/* Side Modal */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowModal(false)}
          />

          {/* Modal - Double Width */}
          <div className="fixed top-0 right-0 h-full w-full md:w-[960px] bg-white z-50 shadow-xl flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Complete Your Booking</h2>
                <p className="text-sm text-gray-500">
                  {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Property Info */}
              <div className="border rounded-xl p-4">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{address}</p>
              </div>

              {/* Selected Rooms */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Selected Rooms</h3>
                {selectedRooms.map((room) => (
                  <div key={room.id} className="border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-gray-500">
                          NPR {room.basePrice.toLocaleString()} per night
                        </p>
                        <p className="text-xs text-gray-400">
                          {room.availableUnits || 8} available
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveRoom(room.id)}
                        className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleRoomQuantityChange(room.id, -1)}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={room.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 text-sm">{room.quantity}</span>
                        <button
                          onClick={() => handleRoomQuantityChange(room.id, 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={room.quantity >= (room.availableUnits || 8)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Select Dates Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Dates</h3>

                <DateRangeCalendar 
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                    min="1"
                    max={maxGuests}
                    className="w-full border rounded-lg px-4 py-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum {maxGuests} guests across all rooms
                  </p>
                </div>
              </div>

              {/* Checkout Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Checkout</h3>

                <div className="border rounded-xl p-4 space-y-2">
                  {totals.nights > 0 ? (
                    <>
                      {selectedRooms.map((room) => (
                        <div key={room.id} className="flex justify-between text-sm text-gray-600">
                          <span>
                            {room.name} × {room.quantity} × {totals.nights} night(s)
                          </span>
                          <span>
                            NPR {(room.basePrice * room.quantity * totals.nights).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between text-sm font-medium">
                        <span>Subtotal</span>
                        <span>NPR {totals.roomTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service Fee (10%)</span>
                        <span>NPR {totals.serviceFee.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (13%)</span>
                        <span>NPR {totals.tax.toFixed(0)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-red-500">
                          NPR {totals.total.toFixed(0)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Select dates to see pricing
                    </p>
                  )}
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={!checkIn || !checkOut || isBooking || selectedRooms.length === 0}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isBooking ? "Processing..." : `Confirm Booking (${selectedRooms.length} room${selectedRooms.length !== 1 ? 's' : ''})`}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccommodationPage;