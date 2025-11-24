import { useState, useMemo } from "react";
import { Eye } from "lucide-react";

import BookingDetailsView from "./BookingDetailsView";
import { useGetTravelBookingsQuery } from "../../../../../../Services/travelBookings";
import LoadingSpinner from "../../../../../LoadingSpinner";
import ErrorMessage from "../../../../../ErrorMessage";
import { FaCalendarAlt } from "react-icons/fa";

const AllTravelBookings = () => {
  const { data, isLoading, isError, error, refetch } = useGetTravelBookingsQuery();
  const bookings = useMemo(() => data?.data || [], [data]);

  const [filters, setFilters] = useState({
    searchCode: "",
    status: "",
    travelDateFrom: "",
    travelDateTo: "",
  });

  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleClearFilters = () => {
    setFilters({
      searchCode: "",
      status: "",
      travelDateFrom: "",
      travelDateTo: "",
    });
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesCode = b.id
        .toLowerCase()
        .includes(filters.searchCode.toLowerCase());
      const matchesStatus = filters.status ? b.status === filters.status : true;
      const matchesDateFrom = filters.travelDateFrom
        ? new Date(b.travelDate) >= new Date(filters.travelDateFrom)
        : true;
      const matchesDateTo = filters.travelDateTo
        ? new Date(b.travelDate) <= new Date(filters.travelDateTo)
        : true;

      return matchesCode && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [bookings, filters]);

  const uniqueStatuses = Array.from(new Set(bookings.map((b) => b.status)));

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-600">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="">
      {selectedBooking ? (
        <BookingDetailsView
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      ) : (
        <>
          <h1 className="text-xl text-red-500 font-semibold mb-2">All Travel Bookings</h1>

          {/* Filters */}
          <div className="mb-4 p-4 bg-gray-100 rounded shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                className="px-3 py-2 text-sm border rounded w-full"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* From Date */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="From date(mm/dd/yyyy)"
                  value={filters.travelDateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, travelDateFrom: e.target.value })
                  }
                  className="pl-10 px-3 py-2 border rounded w-full"
                />
              </div>

              {/* To Date */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="To date(mm/dd/yyyy)"
                  value={filters.travelDateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, travelDateTo: e.target.value })
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
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-900 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-2">Date Created</th>
                    <th className="px-4 py-2">Package</th>
                    <th className="px-4 py-2">Travel Date</th>
                    <th className="px-4 py-2">Travellers</th>
                    <th className="px-4 py-2">Payment</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isError ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-red-500">
                        <ErrorMessage
                          message={error?.message || "Error fetching bookings"}
                          onRetry={refetch}
                        />
                      </td>
                    </tr>
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 text-center">
                        <td className="px-4 py-3">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {b.packageName} <br /> ID: {b.id}
                        </td>
                        <td className="px-4 py-3">{b.travelDate}</td>
                        <td className="px-4 py-3">{b.travellers}</td>
                        <td className="px-4 py-3">{b.payment}</td>
                        <td className="px-4 py-3 font-semibold">${b.total}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              b.status === "Confirmed"
                                ? "bg-green-100 text-green-700"
                                : b.status === "Pending Payment Verification"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex justify-center space-x-2">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
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

export default AllTravelBookings;
