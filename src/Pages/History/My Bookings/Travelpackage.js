// PackageBookings.js
import { useFetchUserProfileQuery } from "../../../Services/userApiSlice";

const PackageBookings = ({ bookings, isFetching, refetch }) => {
  // Fetch user profile to get the customer name
  const { data: userData } = useFetchUserProfileQuery();

  // Get customer name from user profile
  const customerName = userData
    ? `${userData.firstName} ${userData.lastName}`
    : "Guest";

  const handleRefresh = () => {
    if (refetch) refetch();
  };

  return (
    <div className="w-full">
      {/* Refresh Button */}
      {refetch && (
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex bg-indigo-100 border-b border-indigo-200">
          <div className="w-36 px-2 py-3 font-bold text-xs text-indigo-900">Booking ID</div>
          <div className="w-32 px-2 py-3 font-bold text-xs text-indigo-900">Customer</div>
          <div className="w-36 px-2 py-3 font-bold text-xs text-indigo-900">Package</div>
          <div className="w-28 px-2 py-3 font-bold text-xs text-indigo-900">Start Date</div>
          <div className="w-24 px-2 py-3 font-bold text-xs text-indigo-900">Duration</div>
          <div className="w-24 px-2 py-3 font-bold text-xs text-indigo-900">Travelers</div>
          <div className="w-28 px-2 py-3 font-bold text-xs text-indigo-900">Total</div>
          <div className="w-28 px-2 py-3 font-bold text-xs text-indigo-900">Status</div>
        </div>

        {/* Table Body */}
        <div className="max-h-[270px] overflow-y-auto">
          {bookings && bookings.length > 0 ? (
            bookings.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="w-36 px-2 py-3 text-xs text-gray-900 truncate">
                  {item.code || item.bookingCode || item.id}
                </div>

                <div className="w-32 px-2 py-3 text-xs text-gray-900 truncate">
                  {customerName}
                </div>

                <div className="w-36 px-2 py-3 text-xs text-gray-900 truncate">
                  {item.travelPackage?.name || item.packageName || "N/A"}
                </div>

                <div className="w-28 px-2 py-3 text-xs text-gray-900">
                  {item.travelDate 
                    ? new Date(item.travelDate).toLocaleDateString()
                    : item.departure?.date
                    ? new Date(item.departure.date).toLocaleDateString()
                    : "N/A"}
                </div>

                <div className="w-24 px-2 py-3 text-xs text-gray-900">
                  {item.travelPackage?.durationDays || item.duration || "N/A"} days
                </div>

                <div className="w-24 px-2 py-3 text-xs text-gray-900">
                  {item.travellersCount || item.travelers || item.numberOfTravelers || item.pax || 1}
                </div>

                <div className="w-28 px-2 py-3 text-xs text-gray-900">
                  Rs. {item.total || item.totalAmount || (item.travelPackage?.price * (item.travellersCount || 1))}
                </div>

                <div className="w-28 px-2 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-white font-semibold text-xs ${
                      item.status === "CONFIRMED" || item.status === "confirmed" || item.status === "completed"
                        ? "bg-green-600"
                        : item.status === "PENDING_CONFIRMATION" || item.status === "pending"
                        ? "bg-yellow-500"
                        : item.status === "cancelled"
                        ? "bg-red-600"
                        : "bg-orange-500"
                    }`}
                  >
                    {item.status === "PENDING_CONFIRMATION" ? "PENDING" : item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm">
              No package bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageBookings;