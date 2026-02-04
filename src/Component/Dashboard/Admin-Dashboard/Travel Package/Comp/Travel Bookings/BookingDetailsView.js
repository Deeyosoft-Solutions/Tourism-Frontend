import {
  FaArrowLeft,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaInfoCircle,
  FaUsers,
  FaBus,
} from "react-icons/fa";
import { useGetUserByIdQuery } from "../../../../../../Services/userApiSlice";
import { useUpdateBookingStatusMutation } from "../../../../../../Services/travelBookings";
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

const formatStatus = (status) => {
  if (!status) return "N/A";
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const getStatusStyle = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "confirmed":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending_confirmation":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "pending_payment_verification":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
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
          Traveller Information
        </h3>
        <p className="text-gray-500">Loading traveller information...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-gray-500" />
          Traveller Information
        </h3>
        <p className="text-gray-500">Traveller information not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaUser className="text-gray-500" />
        Traveller Information
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Name:</span>
          <span className="text-sm font-medium text-gray-900">
            {data.firstName || data.lastName
              ? `${data.firstName || ""} ${data.lastName || ""}`.trim()
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Email:</span>
          <span className="text-sm font-medium text-gray-900">
            {data.email || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Phone:</span>
          <span className="text-sm font-medium text-gray-900">
            {data.phone || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   Main Component
------------------------------ */
const TravelBookingDetailsView = ({ booking, onClose, onRefetch }) => {
  const [updateBookingStatus, { isLoading: isUpdatingStatus }] =
    useUpdateBookingStatusMutation();
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  const travelDate = booking.departure?.date || booking.travelDate;
  const price =
    booking.departure?.priceOverride || booking.travelPackage?.price || "0";
  const totalPrice = parseFloat(price) * booking.travellersCount;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStatusUpdate = async (newStatus, actionName) => {
    try {
      setActionLoading(actionName);
      await updateBookingStatus({
        id: booking.id,
        status: { status: newStatus },
      }).unwrap();
      if (onRefetch) {
        onRefetch();
      }
      showNotification(
        `Booking ${actionName.toLowerCase()} successfully!`,
        "success",
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
      showNotification(
        error?.data?.message || `Failed to ${actionName.toLowerCase()} booking`,
        "error",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmBooking = () => {
    handleStatusUpdate("CONFIRMED", "Confirmed");
  };

  const handleVerifyPayment = () => {
    handleStatusUpdate("CONFIRMED", "Payment Verified");
  };

  const handleCancelBooking = () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      handleStatusUpdate("CANCELLED", "Cancelled");
    }
  };

  const handlePrintDetails = () => {
    window.print();
  };

  const handleSendEmail = () => {
    showNotification("Email functionality coming soon!", "info");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
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
              Travel Booking Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Booking ID:{" "}
              <span className="font-medium text-blue-600">
                {booking.id.slice(0, 13)}...
              </span>
            </p>
          </div>
          <div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(
                booking.status,
              )}`}
            >
              {formatStatus(booking.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500" />
              Package Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Package Name:</span>
                <span className="text-sm font-medium text-gray-900">
                  {booking.travelPackage?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Package ID:</span>
                <span className="text-sm font-medium text-gray-900 font-mono">
                  {booking.packageId?.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="text-sm font-medium text-gray-900">
                  {booking.travelPackage?.durationDays} Days /{" "}
                  {booking.travelPackage?.durationNights} Nights
                </span>
              </div>
              {booking.travelPackage?.description && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600 block mb-2">
                    Description:
                  </span>
                  <p className="text-sm text-gray-900">
                    {booking.travelPackage.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Travel Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendar className="text-gray-500" />
              Travel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">
                  Travel Date
                </label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {formatDate(travelDate)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">
                  Number of Travellers
                </label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {booking.travellersCount}{" "}
                  {booking.travellersCount === 1 ? "Person" : "People"}
                </p>
              </div>
              {booking.departure && (
                <>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">
                      Departure Status
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1 capitalize">
                      {booking.departure.status?.toLowerCase() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">
                      Available Capacity
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {booking.departure.capacityRemaining} /{" "}
                      {booking.departure.capacityTotal} slots
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Package Inclusions */}
          {(booking.travelPackage?.included?.length > 0 ||
            booking.travelPackage?.notIncluded?.length > 0) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-gray-500" />
                Package Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {booking.travelPackage?.included?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-3 uppercase">
                      ✓ Included
                    </h4>
                    <ul className="space-y-2">
                      {booking.travelPackage.included.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {booking.travelPackage?.notIncluded?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-3 uppercase">
                      ✗ Not Included
                    </h4>
                    <ul className="space-y-2">
                      {booking.travelPackage.notIncluded.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-red-600 mt-0.5">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Travellers */}
          {booking.additionalTravellers && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUsers className="text-gray-500" />
                Additional Travellers
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(booking.additionalTravellers, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-gray-500" />
              Payment Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="text-sm font-medium text-gray-900">
                  {booking.paymentMethod || "N/A"}
                </span>
              </div>
              {booking.receiptImageUrl && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Receipt:</span>
                  <a
                    href={booking.receiptImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Booking Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Timeline
            </h3>
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

        {/* Right Column - Traveller & Payment */}
        <div className="space-y-6">
          {/* Traveller Information */}
          <CustomerDetails customerId={booking.userId} />

          {/* Departure Details */}
          {booking.departure && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaBus className="text-gray-500" />
                Departure Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Departure ID:</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {booking.departureId?.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Departure Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(booking.departure.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {booking.departure.status?.toLowerCase() || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Capacity:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {booking.departure.capacityTotal} people
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {booking.departure.capacityRemaining} slots
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaDollarSign className="text-gray-500" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Price per Person:</span>
                <span className="text-sm font-medium text-gray-900">
                  NPR{" "}
                  {parseFloat(price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Number of Travellers:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {booking.travellersCount}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-base font-semibold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-base font-bold text-gray-900">
                  NPR{" "}
                  {totalPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {booking.paymentMethod || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <div className="space-y-2">
              {booking.status === "PENDING_CONFIRMATION" && (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isUpdatingStatus || actionLoading === "Confirmed"}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === "Confirmed"
                    ? "Confirming..."
                    : "Confirm Booking"}
                </button>
              )}
              {booking.status === "PENDING_PAYMENT_VERIFICATION" && (
                <button
                  onClick={handleVerifyPayment}
                  disabled={
                    isUpdatingStatus || actionLoading === "Payment Verified"
                  }
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === "Payment Verified"
                    ? "Verifying..."
                    : "Verify Payment"}
                </button>
              )}
              {(booking.status === "CONFIRMED" ||
                booking.status === "PENDING_CONFIRMATION" ||
                booking.status === "PENDING_PAYMENT_VERIFICATION") && (
                <button
                  onClick={handleCancelBooking}
                  disabled={isUpdatingStatus || actionLoading === "Cancelled"}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === "Cancelled"
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              )}
              <button
                onClick={handlePrintDetails}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Print Details
              </button>
              <button
                onClick={handleSendEmail}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Send Confirmation Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelBookingDetailsView;
