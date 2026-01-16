const API_BASE_URL = process.env.REACT_APP_API_URL;

const OverviewTab = ({ accommodation, rooms = [], roomsLoading, roomsError }) => {
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
        </div>
      </div>

      {/* Rooms Section */}
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rooms</h2>
        
        {roomsLoading ? (
          <p className="text-sm text-gray-600">Loading rooms...</p>
        ) : roomsError ? (
          <p className="text-sm text-red-600">Error loading rooms</p>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Room Image */}
                {room.images && room.images.length > 0 && (
                  <img
                    src={`${API_BASE_URL}${room.images[0]}`}
                    alt={room.name}
                    className="w-full h-48 object-contain"
                  />
                )}
                
                {/* Room Details */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">
                    {room.name}
                  </h3>
                  
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-semibold text-gray-900">NPR {room.basePrice.toLocaleString()}/night</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Units:</span>
                      <span className="text-gray-900">{room.totalUnits}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="text-gray-900">{room.capacity} guests</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Guests:</span>
                      <span className="text-gray-900">{room.maxGuests} guests</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="text-gray-900">{room.bedrooms}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Beds:</span>
                      <span className="text-gray-900">{room.beds}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="text-gray-900">{room.bathrooms}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Floor:</span>
                      <span className="text-gray-900">{room.floor}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Size:</span>
                      <span className="text-gray-900">{room.roomSizeSqFt} sq ft</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">View Type:</span>
                      <span className="text-gray-900 capitalize">{room.viewType}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900">{room.checkInFrom}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900">{room.checkOutUntil}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Children Allowed:</span>
                      <span className="text-gray-900">{room.childrenAllowed ? 'Yes' : 'No'}</span>
                    </div>

                    {room.childrenAllowed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Children:</span>
                        <span className="text-gray-900">{room.maxChildren}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Extra Guest Fee:</span>
                      <span className="text-gray-900">NPR {room.extraGuestFee}</span>
                    </div>
                  </div>

                  {/* Room Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="mt-4 flex gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        room.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-red-800"
                      }`}
                    >
                      {room.status}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        room.published
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room.published ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No rooms available for this property.</p>
        )}
      </div>

      {/* Images */}
      {accommodation.images && accommodation.images.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
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

export default OverviewTab;