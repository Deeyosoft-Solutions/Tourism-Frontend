const BookingsTab = ({ accommodation }) => {
  const bookings = accommodation.bookings || [];

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-900 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-3">Guest Name</th>
            <th className="px-6 py-3">Check-in</th>
            <th className="px-6 py-3">Check-out</th>
            <th className="px-6 py-3">Guests</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{booking.guestName}</td>
              <td className="px-6 py-4">{booking.checkIn}</td>
              <td className="px-6 py-4">{booking.checkOut}</td>
              <td className="px-6 py-4">{booking.guests}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4">Rs. {booking.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTab;