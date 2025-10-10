import {
  FaBed,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminAccomodationsOverview = () => {
  const navigate = useNavigate();

  // Example stats — replace with API data
  const stats = [
    {
      id: 1,
      title: "Total Accommodations",
      value: 12,
      icon: <FaBed size={32} className="text-red-500" />,
    },
    {
      id: 2,
      title: "Total Bookings",
      value: 45,
      icon: <FaCalendarAlt size={32} className="text-blue-500" />,
    },
    {
      id: 3,
      title: "Total Guests",
      value: 120,
      icon: <FaUsers size={32} className="text-indigo-500" />,
    },
    {
      id: 4,
      title: "Pending Requests",
      value: 8,
      icon: <FaClipboardList size={32} className="text-yellow-500" />,
    },
  ];

  const recentBookings = [
    {
      id: "B001",
      guestName: "John Doe",
      accommodationName: "Hotel Sunshine",
      date: "2025-10-01",
    },
    {
      id: "B002",
      guestName: "Jane Smith",
      accommodationName: "Mountain View Lodge",
      date: "2025-10-03",
    },
    {
      id: "B003",
      guestName: "Alice Johnson",
      accommodationName: "Lakefront Resort",
      date: "2025-10-05",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Accommodations Overview</h1>
        <button
          onClick={() =>
            navigate("/dashboard/accomodations?view=stays&stay=all")
          }
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaEye /> Show All Accommodations
        </button>
      </div>

      {/* Quick stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-left hover:bg-gray-50 transition flex items-center justify-between`}
          >
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full mr-4">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-4">
          Recent Bookings
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accommodation
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{booking.id}</td>
                  <td className="px-4 py-2">{booking.guestName}</td>
                  <td className="px-4 py-2">{booking.accommodationName}</td>
                  <td className="px-4 py-2">{booking.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAccomodationsOverview;
