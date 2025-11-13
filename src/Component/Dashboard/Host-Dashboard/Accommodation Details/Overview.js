const API_BASE_URL = process.env.REACT_APP_API_URL;

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

export default OverviewTab;