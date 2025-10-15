
const BookingDetailsView = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="p-6 bg-white rounded shadow-md min-h-screen">
      <button
        onClick={onClose}
        className="mb-4 font-poppins font-semibold hover:underline"
      >
        &larr; Go Back
      </button>

      <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Code:</strong> {booking.code}</p>
        <p><strong>Guest Name:</strong> {booking.guestName}</p>
        <p><strong>Guest Email:</strong> {booking.guestEmail}</p>
        <p><strong>Property:</strong> {booking.propertyName}</p>
        <p><strong>Room:</strong> {booking.roomName}</p>
        <p><strong>Check-in:</strong> {booking.checkIn}</p>
        <p><strong>Check-out:</strong> {booking.checkOut}</p>
        <p><strong>Quantity / Guests:</strong> {booking.quantity} / {booking.guests}</p>
        <p><strong>Total:</strong> NPR {Number(booking.total).toLocaleString()}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Created:</strong> {new Date(booking.createdAt).toDateString()}</p>
      </div>
    </div>
  );
};

export default BookingDetailsView;
