import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { FaCalendarAlt } from "react-icons/fa";

import LoadingSpinner from "../../../../LoadingSpinner";
import ErrorMessage from "../../../../ErrorMessage";
import BookingDetailsView from "./BookingDetails";

import { useGetRoomBookingsQuery } from "../../../../../Services/accommodationBooking";
import { useGetAccommodationsQuery } from "../../../../../Services/accomodationApiSlice";
import { useGetUserByIdQuery } from "../../../../../Services/userApiSlice";

/* -----------------------------
   Helpers
------------------------------ */
const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CustomerInfo = ({ customerId }) => {
  const { data, isLoading } = useGetUserByIdQuery(customerId, {
    skip: !customerId,
  });

  if (isLoading) {
    return <p className="text-gray-400 text-sm">Loading...</p>;
  }

  return (
    <div>
      <p className="text-gray-500 text-xs">{data?.email || ""}</p>
    </div>
  );
};

/* -----------------------------
   Component
------------------------------ */
const ForAdminBookings = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetRoomBookingsQuery();

  const { data: accommodationsData } = useGetAccommodationsQuery();

  const bookings = useMemo(() => data?.data || [], [data]);

  const accommodationMap = useMemo(() => {
    return new Map(
      accommodationsData?.data?.map((a) => [a.id, a.name])
    );
  }, [accommodationsData]);

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

  /* -----------------------------
     Filtering
  ------------------------------ */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesCode = b.code
        ?.toLowerCase()
        .includes(filters.searchCode.toLowerCase());

      const matchesStatus = filters.status
        ? b.status === filters.status
        : true;

      const matchesProperty = filters.property
        ? accommodationMap.get(b.accommodationId) === filters.property
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
  }, [bookings, filters, accommodationMap]);

  const uniqueStatuses = Array.from(new Set(bookings.map((b) => b.status)));

  const uniqueProperties = Array.from(
    new Set(
      bookings.map((b) => accommodationMap.get(b.accommodationId))
    )
  ).filter(Boolean);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {selectedBooking ? (
        <BookingDetailsView
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      ) : (
        <>
          <h1 className="text-xl text-red-500 font-semibold mb-2">
            All Bookings
          </h1>

          {/* Filters */}
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
                  type="date"
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
                  type="date"
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
                className="font-semibold hover:underline text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-center text-xs">Code</th>
                  <th className="px-4 py-2 text-center text-xs">Guest</th>
                  <th className="px-4 py-2 text-center text-xs">Property</th>
                  <th className="px-4 py-2 text-center text-xs">Room</th>
                  <th className="px-4 py-2 text-center text-xs">Dates</th>
                  <th className="px-4 py-2 text-center text-xs">Qty/Guests</th>
                  <th className="px-4 py-2 text-center text-xs">Total</th>
                  <th className="px-4 py-2 text-center text-xs">Status</th>
                  <th className="px-4 py-2 text-center text-xs">Created</th>
                  <th className="px-4 py-2 text-center text-xs">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isError ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-red-500">
                      <ErrorMessage
                        message={error?.message || "Error fetching bookings"}
                        onRetry={refetch}
                      />
                    </td>
                  </tr>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.code} className="hover:bg-gray-100 text-center">
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        {booking.code}
                      </td>

                      <td className="px-4 py-3">
                        <CustomerInfo customerId={booking.customerId} />
                      </td>

                      <td className="px-4 py-3">
                        {accommodationMap.get(booking.accommodationId) || "N/A"}
                      </td>

                      <td className="px-4 py-3">{booking.roomName}</td>

                      <td className="px-4 py-3">
                        {formatDate(booking.checkIn)} –{" "}
                        {formatDate(booking.checkOut)}
                      </td>

                      <td className="px-4 py-3">
                        {booking.quantity} / {booking.guests}
                      </td>

                      <td className="px-4 py-3 font-semibold">
                        NPR {Number(booking.total).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-gray-500">
                      No bookings available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ForAdminBookings;
