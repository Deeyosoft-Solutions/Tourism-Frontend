import { useMemo } from "react";
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
   Component
------------------------------ */
const BookingsTab = ({ accommodation }) => {
  // accommodation = API response object
  const bookings = useMemo(
    () => accommodation?.data || [],
    [accommodation]
  );

  if (!bookings.length) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No bookings yet</p>
      </div>
    );
  }

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
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-blue-600 font-medium">
                  {booking.code}
                </td>

                <td className="px-4 py-2 text-sm text-gray-800">
                  <CustomerName customerId={booking.customerId} />
                </td>

                <td className="px-4 py-2 text-sm text-gray-800">
                  {formatDate(booking.checkIn)} –{" "}
                  {formatDate(booking.checkOut)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTab;
