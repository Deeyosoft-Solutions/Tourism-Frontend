import { FaArrowLeft, FaUser, FaCalendar, FaHome, FaDollarSign, FaInfoCircle } from "react-icons/fa";
import { useGetUserByIdQuery } from "../../../../../Services/userApiSlice";
import { useGetAccommodationsQuery } from "../../../../../Services/accomodationApiSlice";
import { 
  useCancelRoomBookingMutation,
  useUpdateRoomBookingStatusMutation 
} from "../../../../../Services/accommodationBooking";
import { useState } from "react";

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

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "confirmed":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "expired":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getPaymentStatusStyle = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "paid":
      return "text-green-600";
    case "unpaid":
      return "text-red-600";
    case "partial":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/* -----------------------------
   Customer Details Component
------------------------------ */
const CustomerDetails = ({ customerId }) => {
  const { data, isLoading, error } = useGetUserByIdQuery(customerId, {
    skip: !customerId,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-gray-500" />
          Guest Information
        </h3>
        <p className="text-gray-500">Loading guest information...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-gray-500" />
          Guest Information
        </h3>
        <p className="text-gray-500">Guest information not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaUser className="text-gray-500" />
        Guest Information
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Name:</span>
          <span className="text-sm font-medium text-gray-900">
            {data.firstName || data.lastName 
              ? `${data.firstName || ''} ${data.lastName || ''}`.trim()
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Email:</span>
          <span className="text-sm font-medium text-gray-900">{data.email || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Phone:</span>
          <span className="text-sm font-medium text-gray-900">{data.phone || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   Main Component
------------------------------ */
const BookingDetailsView = ({ booking, onClose, onRefetch }) => {
  const { data: accommodationsData } = useGetAccommodationsQuery();
  const [cancelRoomBooking, { isLoading: isCancelling }] = useCancelRoomBookingMutation();
  const [updateRoomBookingStatus, { isLoading: isUpdating }] = useUpdateRoomBookingStatusMutation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const accommodationName = accommodationsData?.data?.find(
    (a) => a.id === booking.accommodationId
  )?.name || 'N/A';

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  // Handle confirm booking
  const handleConfirmBooking = async () => {
    try {
      await updateRoomBookingStatus({
        id: booking.id,
        status: 'confirmed'
      }).unwrap();
      if (onRefetch) {
        onRefetch();
      }
      // Show success notification or toast here
      alert('Booking confirmed successfully!');
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      alert('Failed to confirm booking. Please try again.');
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async () => {
    try {
      await cancelRoomBooking({
        id: booking.id,
      }).unwrap();
      if (onRefetch) {
        onRefetch();
      }
      setShowCancelConfirm(false);
      // Show success notification or toast here
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Booking</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                disabled={isCancelling}
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition"
        >
          <FaArrowLeft size={14} /> Back to Bookings
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Booking Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Booking Code: <span className="font-medium text-blue-600">{booking.code}</span>
            </p>
          </div>
          <div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaHome className="text-gray-500" />
              Property Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Property Name:</span>
                <span className="text-sm font-medium text-gray-900">
                  {accommodationName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Property ID:</span>
                <span className="text-sm font-medium text-gray-900 font-mono">
                  {booking.accommodationId.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendar className="text-gray-500" />
              Booking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Check-in</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {formatDate(booking.checkIn)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Check-out</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {formatDate(booking.checkOut)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Duration</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {nights} {nights === 1 ? 'Night' : 'Nights'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Number of Guests</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaHome className="text-gray-500" />
              Room Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Room ID:</span>
                <span className="text-sm font-medium text-gray-900 font-mono">
                  {booking.roomId.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="text-sm font-medium text-gray-900">
                  {booking.qty} {booking.qty === 1 ? 'Room' : 'Rooms'}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Units */}
          {booking.bookingUnits && booking.bookingUnits.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Units</h3>
              <div className="space-y-2">
                {booking.bookingUnits.map((bookingUnit) => (
                  <div 
                    key={bookingUnit.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {bookingUnit.unit.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {bookingUnit.unit.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {bookingUnit.unit.id.slice(0, 8)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method & Transaction */}
          {(booking.paymentMethod || booking.transactionId) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-gray-500" />
                Payment Information
              </h3>
              <div className="space-y-3">
                {booking.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {booking.paymentMethod}
                    </span>
                  </div>
                )}
                {booking.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction ID:</span>
                    <span className="text-sm font-medium text-gray-900 font-mono">
                      {booking.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Created At:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(booking.createdAt)}
                </span>
              </div>
              {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(booking.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Guest & Payment */}
        <div className="space-y-6">
          {/* Guest Information */}
          <CustomerDetails customerId={booking.customerId} />

          {/* Payment Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaDollarSign className="text-gray-500" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  NPR {Number(booking.subtotal).toLocaleString()}
                </span>
              </div>
              
              {booking.cleaningFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cleaning Fee:</span>
                  <span className="text-sm font-medium text-gray-900">
                    NPR {Number(booking.cleaningFee).toLocaleString()}
                  </span>
                </div>
              )}
              
              {booking.extraGuestFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Extra Guest Fee:</span>
                  <span className="text-sm font-medium text-gray-900">
                    NPR {Number(booking.extraGuestFee).toLocaleString()}
                  </span>
                </div>
              )}
              
              {booking.serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service Fee:</span>
                  <span className="text-sm font-medium text-gray-900">
                    NPR {Number(booking.serviceFee).toLocaleString()}
                  </span>
                </div>
              )}
              
              {booking.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax:</span>
                  <span className="text-sm font-medium text-gray-900">
                    NPR {Number(booking.tax).toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-base font-semibold text-gray-900">Total Amount:</span>
                <span className="text-base font-bold text-gray-900">
                  NPR {Number(booking.total).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <span className={`text-sm font-semibold uppercase ${getPaymentStatusStyle(booking.paymentStatus)}`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                onClick={() => alert('Edit functionality to be implemented')}
              >
                Edit Booking
              </button>
              {booking.status?.toLowerCase() === 'pending' && (
                <button 
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirmBooking}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Confirming...' : 'Confirm Booking'}
                </button>
              )}
              {(booking.status?.toLowerCase() === 'confirmed' || booking.status?.toLowerCase() === 'pending') && (
                <button 
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isCancelling}
                >
                  Cancel Booking
                </button>
              )}
              <button 
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                onClick={handlePrint}
              >
                Print Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;