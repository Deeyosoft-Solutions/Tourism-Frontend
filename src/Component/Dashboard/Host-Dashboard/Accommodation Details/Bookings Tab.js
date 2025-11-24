const BookingsTab = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No bookings yet</p>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Property Bookings</h1>
        <p className="text-sm text-gray-500">All bookings for this property</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{booking.code}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.guestName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.room}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {booking.checkIn} - {booking.checkOut}
                  </div>
                  <div className="text-xs text-gray-500">{booking.nights} nights</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.guests}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.total}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
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