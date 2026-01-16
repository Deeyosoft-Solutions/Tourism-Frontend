import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { useGetUserByIdQuery } from "../../../../../Services/userApiSlice";

/* -----------------------------
   Helpers
------------------------------ */
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
    case "expired":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getQuickFilterDates = (filter) => {
  const today = new Date();
  const from = new Date(today);
  const to = new Date(today);
  
  if (filter === "next7d") {
    to.setDate(today.getDate() + 7);
  } else if (filter === "next30d") {
    to.setDate(today.getDate() + 30);
  }
  
  return { from, to };
};

/* -----------------------------
   Customer Resolver
------------------------------ */
const CustomerName = ({ customerId }) => {
  const { data, isLoading } = useGetUserByIdQuery(customerId, {
    skip: !customerId,
  });

  if (isLoading) {
    return <span className="text-gray-400 text-sm">Loading...</span>;
  }

  return <span>{data?.email || "N/A"}</span>;
};

/* -----------------------------
   Filter Component
------------------------------ */
const BookingFilters = ({ onFilterChange, bookingCount }) => {
  const [searchCode, setSearchCode] = useState("");
  const [status, setStatus] = useState("all");
  const [property, setProperty] = useState("all");
  const [checkInFrom, setCheckInFrom] = useState("");
  const [checkInTo, setCheckInTo] = useState("");
  const [quickFilter, setQuickFilter] = useState("");

  const handleQuickFilter = (filter) => {
    setQuickFilter(filter);
    const { from, to } = getQuickFilterDates(filter);
    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];
    setCheckInFrom(fromStr);
    setCheckInTo(toStr);
    
    onFilterChange({
      searchCode,
      status,
      property,
      checkInFrom: fromStr,
      checkInTo: toStr,
    });
  };

  const handleClearFilters = () => {
    setSearchCode("");
    setStatus("all");
    setProperty("all");
    setCheckInFrom("");
    setCheckInTo("");
    setQuickFilter("");
    onFilterChange({
      searchCode: "",
      status: "all",
      property: "all",
      checkInFrom: "",
      checkInTo: "",
    });
  };

  const applyFilters = () => {
    onFilterChange({
      searchCode,
      status,
      property,
      checkInFrom,
      checkInTo,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by booking code"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            onFilterChange({
              searchCode,
              status: e.target.value,
              property,
              checkInFrom,
              checkInTo,
            });
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>

        {/* Property Filter */}
        <select
          value={property}
          onChange={(e) => {
            setProperty(e.target.value);
            onFilterChange({
              searchCode,
              status,
              property: e.target.value,
              checkInFrom,
              checkInTo,
            });
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
        >
          <option value="all">All Properties</option>
        </select>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Check-in From */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Check-in from
          </label>
          <input
            type="date"
            value={checkInFrom}
            onChange={(e) => {
              setCheckInFrom(e.target.value);
              setQuickFilter("");
            }}
            onBlur={applyFilters}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Check-in To */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Check-in to
          </label>
          <input
            type="date"
            value={checkInTo}
            onChange={(e) => {
              setCheckInTo(e.target.value);
              setQuickFilter("");
            }}
            onBlur={applyFilters}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quick filters
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickFilter("next7d")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                quickFilter === "next7d"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Next 7d
            </button>
            <button
              onClick={() => handleQuickFilter("next30d")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                quickFilter === "next30d"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Next 30d
            </button>
          </div>
        </div>
      </div>

      {/* Results Count and Clear */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {bookingCount} {bookingCount === 1 ? 'booking' : 'bookings'} found
        </p>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};

/* -----------------------------
   Main Component
------------------------------ */
const BookingsTab = ({ accommodation, onViewBookingDetails }) => {
  const [filters, setFilters] = useState({
    searchCode: "",
    status: "all",
    property: "all",
    checkInFrom: "",
    checkInTo: "",
  });

  const bookings = useMemo(
    () => accommodation?.data || [],
    [accommodation]
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search by code
      if (filters.searchCode && !booking.code?.toLowerCase().includes(filters.searchCode.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (filters.status !== "all" && booking.status?.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // Filter by check-in date range
      if (filters.checkInFrom) {
        const checkIn = new Date(booking.checkIn);
        const fromDate = new Date(filters.checkInFrom);
        if (checkIn < fromDate) return false;
      }

      if (filters.checkInTo) {
        const checkIn = new Date(booking.checkIn);
        const toDate = new Date(filters.checkInTo);
        if (checkIn > toDate) return false;
      }

      return true;
    });
  }, [bookings, filters]);

  return (
    <div className="bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-red-500 mb-1">
          Property Bookings
        </h1>
        <p className="text-sm text-gray-500">
          All bookings for this property
        </p>
      </div>

      <BookingFilters 
        onFilterChange={setFilters}
        bookingCount={filteredBookings.length}
      />

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Guest
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Dates
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Qty / Guests
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-blue-600 font-medium">
                    {booking.code}
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-800">
                    <CustomerName customerId={booking.customerId} />
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-800">
                    {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-800">
                    {booking.qty} / {booking.guests}
                  </td>

                  <td className="px-4 py-2 text-sm font-semibold text-gray-800">
                    NPR {Number(booking.total).toLocaleString()}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-xs text-gray-500">
                    {formatDate(booking.createdAt)}
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => onViewBookingDetails(booking)}
                      className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center mx-auto"
                      title="View Details"
                    >
                      <FaEye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;