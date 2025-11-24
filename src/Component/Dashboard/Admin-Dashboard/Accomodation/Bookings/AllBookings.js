import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import LoadingSpinner from "../../../../LoadingSpinner";
import ErrorMessage from "../../../../ErrorMessage";
import { useGetAccommodationBookingsQuery } from "../../../../../Services/accommodationBooking";
import BookingDetailsView from "./BookingDetails";
import { FaCalendarAlt } from "react-icons/fa";

const ForAdminBookings = () => {
  const { data, isLoading, isError, error, refetch } = useGetAccommodationBookingsQuery();
  const bookings = useMemo(() => data?.data || [], [data]);

  const [filters, setFilters] = useState({
    searchCode: "",
    status: "",
    property: "",
    checkInFrom: "",
    checkInTo: "",
  });

  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleClearFilters = () => {
    setFilters({
      searchCode: "",
      status: "",
      property: "",
      checkInFrom: "",
      checkInTo: "",
    });
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesCode = b.code
        .toLowerCase()
        .includes(filters.searchCode.toLowerCase());
      const matchesStatus = filters.status ? b.status === filters.status : true;
      const matchesProperty = filters.property
        ? b.propertyName === filters.property
        : true;
      const matchesCheckInFrom = filters.checkInFrom
        ? new Date(b.checkIn) >= new Date(filters.checkInFrom)
        : true;
      const matchesCheckInTo = filters.checkInTo
        ? new Date(b.checkIn) <= new Date(filters.checkInTo)
        : true;

      return (
        matchesCode &&
        matchesStatus &&
        matchesProperty &&
        matchesCheckInFrom &&
        matchesCheckInTo
      );
    });
  }, [bookings, filters]);

  const uniqueStatuses = Array.from(new Set(bookings.map((b) => b.status)));
  const uniqueProperties = Array.from(
    new Set(bookings.map((b) => b.propertyName))
  );

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-600">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {selectedBooking ? (
        <BookingDetailsView
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      ) : (
        <>
          <h1 className="text-xl text-red-500 font-semibold mb-2">All Bookings</h1>

          {/* Filters Section */}
          <div className="mb-4 p-4 bg-gray-100 rounded shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Search by Code"
                value={filters.searchCode}
                onChange={(e) =>
                  setFilters({ ...filters, searchCode: e.target.value })
                }
                className="px-3 py-2 border rounded w-full"
              />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-3 py-2 border text-sm rounded w-full"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={filters.property}
                onChange={(e) =>
                  setFilters({ ...filters, property: e.target.value })
                }
                className="px-3 py-2 border text-sm rounded w-full"
              >
                <option value="">All Properties</option>
                {uniqueProperties.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="From date(mm/dd/yyyy)"
                  value={filters.checkInFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, checkInFrom: e.target.value })
                  }
                  className="pl-10 px-3 py-2 border rounded w-full"
                />
              </div>

              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="To date(mm/dd/yyyy)"
                  value={filters.checkInTo}
                  onChange={(e) =>
                    setFilters({ ...filters, checkInTo: e.target.value })
                  }
                  className="pl-10 px-3 py-2 border rounded w-full"
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleClearFilters}
                className="font-poppins font-semibold hover:underline text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg shadow-md overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Guest
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Property
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Room
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Qty/Guests
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="10" className="text-center py-6">
                        <LoadingSpinner /> Loading bookings...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-6 text-red-500"
                      >
                        <ErrorMessage
                          message={error?.message || "Error fetching bookings"}
                          onRetry={refetch}
                        />
                      </td>
                    </tr>
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.code}
                        className="hover:bg-gray-100 text-center"
                      >
                        <td className="px-4 py-3 text-blue-600 font-medium">
                          {booking.code}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          <div>
                            <p className="font-semibold">{booking.guestName}</p>
                            <p className="text-gray-500 text-xs">
                              {booking.guestEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {booking.propertyName}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {booking.roomName}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {booking.checkIn} - {booking.checkOut}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {booking.quantity} / {booking.guests}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          NPR {Number(booking.total).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : booking.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(booking.createdAt).toDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-6 text-gray-500"
                      >
                        No bookings available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForAdminBookings;
