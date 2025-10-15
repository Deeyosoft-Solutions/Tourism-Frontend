import { Package, Calendar, Users, Clock } from "lucide-react";
import { FaEye } from "react-icons/fa";

const OverviewComponent = ({ packages, navigateTo }) => {
  const totalPackages = packages.length;
  const totalBookings = packages.reduce(
    (sum, pkg) => sum + (pkg.bookings?.length || 0),
    0
  );
  const upcomingDepartures = packages.filter(
    (pkg) => pkg.upcomingDepartures?.length > 0
  ).length;
  const pendingActions = packages.filter((pkg) => pkg.pendingActions).length;

  // Gather recent bookings (latest 5)
  const recentBookings = packages
    .flatMap((pkg) => pkg.bookings?.map((b) => ({ ...b, packageName: pkg.name })) || [])
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-red-500 font-semibold">
            Travel Packages Overview
          </h1>
          <p className="text-gray-600">
            Monitor your travel package performance and bookings
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigateTo("packages")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaEye /> View All Packages
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button
          type="button"
          onClick={() => navigateTo("packages")}
          className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-left hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div>
            <p className="text-gray-600 text-sm">All Packages</p>
            <p className="text-2xl font-bold text-gray-900">{totalPackages}</p>
          </div>
          <Package className="h-8 w-8 text-blue-600 flex-shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo("bookings")}
          className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-left hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div>
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>
          <Users className="h-8 w-8 text-orange-600 flex-shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo("departures")}
          className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-left hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div>
            <p className="text-gray-600 text-sm">Upcoming Departures</p>
            <p className="text-2xl font-bold text-gray-900">
              {upcomingDepartures}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-green-600 flex-shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo("pending-actions")}
          className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-left hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div>
            <p className="text-gray-600 text-sm">Pending Actions</p>
            <p className="text-2xl font-bold text-gray-900">{pendingActions}</p>
          </div>
          <Clock className="h-8 w-8 text-purple-600 flex-shrink-0" />
        </button>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Recent Bookings</h3>
        {recentBookings.length > 0 ? (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {recentBookings.map((booking, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-gray-100 pb-2"
              >
                <div>
                  <p className="font-medium text-gray-900">{booking.customerName}</p>
                  <p className="text-gray-500 text-sm">
                    {booking.packageName} - {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-gray-400 text-sm">{booking.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent bookings</p>
        )}
      </div>
    </div>
  );
};

export default OverviewComponent;
