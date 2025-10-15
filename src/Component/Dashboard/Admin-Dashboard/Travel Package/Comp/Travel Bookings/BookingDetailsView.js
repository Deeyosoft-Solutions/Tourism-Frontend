import React from "react";

const BookingDetailsView = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow">
      {/* Header with Go Back button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Booking Details</h2>
        <button
          onClick={onClose}
          className="mb-4 font-poppins font-semibold hover:underline"
        >
          &larr; Go Back
        </button>
      </div>

      {/* Booking Info */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Booking ID:</span>
          <span>{booking.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Package Name:</span>
          <span>{booking.packageName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date Created:</span>
          <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Travel Date:</span>
          <span>{booking.travelDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Travellers:</span>
          <span>{booking.travellers}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Payment Method:</span>
          <span>{booking.payment}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Total Amount:</span>
          <span>${booking.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              booking.status === "Confirmed"
                ? "bg-green-100 text-green-700"
                : booking.status === "Pending Payment Verification"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {booking.status}
          </span>
        </div>
        {booking.notes && (
          <div className="flex justify-between">
            <span className="font-medium">Notes:</span>
            <span>{booking.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsView;
