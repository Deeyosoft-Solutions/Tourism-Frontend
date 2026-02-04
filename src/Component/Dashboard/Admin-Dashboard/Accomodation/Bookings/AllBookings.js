import { useState, useMemo } from "react";
import { Eye, X } from "lucide-react";
import { FaCalendarAlt } from "react-icons/fa";

import LoadingSpinner from "../../../../LoadingSpinner";
import ErrorMessage from "../../../../ErrorMessage";
import BookingDetailsView from "./BookingDetails";

import { useGetAccommodationsQuery } from "../../../../../Services/accomodationApiSlice";
import { useGetUserByIdQuery } from "../../../../../Services/userApiSlice";
import { useGetRoomBookingsQuery } from "../../../../../Services/accommodationBooking";
import { useCancelBookingMutation, useUpdateBookingStatusMutation } from "../../../../../Services/accommodationRoomApiSlice";

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

const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "expired":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
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
   Status Dropdown Component
------------------------------ */
const BookingStatusDropdown = ({ booking, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await onStatusChange(booking.id, newStatus);
    setIsUpdating(false);
    setIsOpen(false);
  };

  const currentStatus = booking.status?.toLowerCase();
  
  // Final states that cannot be changed
  const finalStates = ["cancelled", "expired"];
  const isFinalState = finalStates.includes(currentStatus);
  
  // Define allowed transitions based on current status
  const getAvailableStatuses = (current) => {
    switch (current) {
      case "pending":
        return ["confirmed", "cancelled"];
      case "confirmed":
        return ["cancelled"];
      case "cancelled":
      case "expired":
        return []; // No transitions allowed from final states
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => !isFinalState && setIsOpen(!isOpen)}
        disabled={isUpdating || isFinalState}
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
          booking.status
        )} ${!isFinalState ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed'} transition disabled:opacity-50`}
        title={isFinalState ? "Cannot change final state" : "Click to change status"}
      >
        {isUpdating ? "Updating..." : booking.status}
      </button>

      {isOpen && availableStatuses.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* -----------------------------
   Action Buttons Component
------------------------------ */
const BookingActions = ({ booking, onView, onCancel }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    await onCancel(booking.id);
    setIsCancelling(false);
    setShowCancelConfirm(false);
  };

  // Only allow cancellation for non-final states
  const canCancel = ["confirmed", "pending"].includes(
    booking.status?.toLowerCase()
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onView(booking)}
        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>

      {canCancel && (
        <div className="relative">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
            title="Cancel Booking"
            disabled={isCancelling}
          >
            <X className="w-4 h-4" />
          </button>

          {showCancelConfirm && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowCancelConfirm(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200 p-3">
                <p className="text-xs text-gray-700 mb-2">
                  Cancel this booking?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isCancelling ? "..." : "Yes"}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
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

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [cancelBooking] = useCancelBookingMutation();

  const bookings = useMemo(() => data?.data || [], [data]);

  const accommodationMap = useMemo(() => {
    return new Map(accommodationsData?.data?.map((a) => [a.id, a.name]));
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus({ id: bookingId, status: newStatus }).unwrap();
      refetch();
      // Optionally show success message
    } catch (err) {
      console.error("Failed to update status:", err);
      // Optionally show error message
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId).unwrap();
      refetch();
      // Optionally show success message
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      // Optionally show error message
    }
  };

  /* -----------------------------
     Filtering
  ------------------------------ */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesCode = b.code
        ?.toLowerCase()
        .includes(filters.searchCode.toLowerCase());

      const matchesStatus = filters.status ? b.status === filters.status : true;

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
    new Set(bookings.map((b) => accommodationMap.get(b.accommodationId)))
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
          onRefetch={refetch}
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
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Code
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Guest
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Property
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Room
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Dates
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Qty/Guests
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Created
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Actions
                  </th>
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
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 text-center"
                    >
                      <td className="px-4 py-3 text-blue-600 font-medium text-sm">
                        {booking.code}
                      </td>

                      <td className="px-4 py-3">
                        <CustomerInfo customerId={booking.customerId} />
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {accommodationMap.get(booking.accommodationId) || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {booking.roomId?.slice(0, 8)}...
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(booking.checkIn)} –{" "}
                        {formatDate(booking.checkOut)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {booking.qty} / {booking.guests}
                      </td>

                      <td className="px-4 py-3 font-semibold text-sm text-gray-900">
                        NPR {Number(booking.total).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        <BookingStatusDropdown
                          booking={booking}
                          onStatusChange={handleStatusChange}
                        />
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <BookingActions
                          booking={booking}
                          onView={setSelectedBooking}
                          onCancel={handleCancelBooking}
                        />
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