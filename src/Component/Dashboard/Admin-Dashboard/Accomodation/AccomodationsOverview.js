import {
  FaBed,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useGetAccommodationsQuery } from "../../../../Services/accomodationApiSlice";
import { useGetRoomBookingsQuery } from "../../../../Services/accommodationBooking";
import { useGetUserByIdQuery } from "../../../../Services/userApiSlice";

/* -----------------------------
   Helper Component: User Name
------------------------------ */
const CustomerName = ({ customerId }) => {
  const { data, isLoading } = useGetUserByIdQuery(customerId, {
    skip: !customerId,
  });

  if (isLoading) {
    return <span className="text-gray-400">Loading...</span>;
  }

  return <span>{data?.email || "N/A"}</span>;
};

/* -----------------------------
   Main Component
------------------------------ */
const AdminAccomodationsOverview = () => {
  const navigate = useNavigate();

  // Fetch data
  const { data: accommodationsData, isLoading: loadingAccommodations } =
    useGetAccommodationsQuery();

  const { data: bookingsData, isLoading: loadingBookings } =
    useGetRoomBookingsQuery();

  /* -----------------------------
     Derived Data
  ------------------------------ */

  const totalAccommodations = accommodationsData?.meta?.total || 0;
  const totalBookings = bookingsData?.total || 0;

  // Unique guests using customerId
  const uniqueGuests = bookingsData?.data
    ? new Set(bookingsData.data.map((b) => b.customerId)).size
    : 0;

  const pendingRequests = bookingsData?.data
    ? bookingsData.data.filter((b) => b.status === "pending").length
    : 0;

  // Map accommodationId -> name
  const accommodationMap = new Map(
    accommodationsData?.data?.map((acc) => [acc.id, acc.name])
  );

  const recentBookings = bookingsData?.data?.slice(0, 3) || [];

  if (loadingAccommodations || loadingBookings) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* -----------------------------
     Stats Cards
  ------------------------------ */
  const stats = [
    {
      id: 1,
      title: "Total Accommodations",
      value: totalAccommodations,
      icon: <FaBed size={32} className="text-red-500" />,
    },
    {
      id: 2,
      title: "Total Bookings",
      value: totalBookings,
      icon: <FaCalendarAlt size={32} className="text-blue-500" />,
    },
    {
      id: 3,
      title: "Total Guests",
      value: uniqueGuests,
      icon: <FaUsers size={32} className="text-indigo-500" />,
    },
    {
      id: 4,
      title: "Pending Requests",
      value: pendingRequests,
      icon: <FaClipboardList size={32} className="text-yellow-500" />,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-red-500 font-semibold">
          Accommodations Overview
        </h1>

        <button
          onClick={() =>
            navigate("/dashboard/accomodations?view=stays&stay=all")
          }
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaEye /> Show All Accommodations
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <div className="p-3 rounded-full">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-4">
          Recent Bookings
        </h2>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Booking ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Guest
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Accommodation
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{booking.id}</td>

                    <td className="px-4 py-2 text-sm text-gray-500">
                      <CustomerName customerId={booking.customerId} />
                    </td>

                    <td className="px-4 py-2">
                      {accommodationMap.get(booking.accommodationId) || "N/A"}
                    </td>

                    <td className="px-4 py-2">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent bookings</p>
        )}
      </div>
    </div>
  );
};

export default AdminAccomodationsOverview;
