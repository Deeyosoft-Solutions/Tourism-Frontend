// MyBookings.js
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGetUserBookingsQuery } from '../../Services/userApiSlice';

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Get userId from route state or params
  const userId = location.state?.userId;

  // Single API call to get all bookings
  const {
    data: bookingsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetUserBookingsQuery(userId, {
    skip: !userId,
  });

  // Extract and combine all bookings into a unified format
  const productBookings = (bookingsData?.products?.filter(
    (o) => o.status === "processing" || o.status === "completed"
  ) || []).map(item => ({
    id: item.id,
    type: 'Product',
    item: item.items?.map(i => i.productId).join(', ') || 'Product',
    purchaseDate: item.createdAt,
    payment: item.paymentMethod || 'QR',
    total: `Npr ${item.total}`,
    status: item.status === 'completed' ? 'Shipped out' : 'Pending Payment Verification',
    rawStatus: item.status
  }));

  const accommodationBookings = (bookingsData?.accommodations || []).map(item => ({
    id: item.id,
    type: 'Accomodation',
    item: item.room?.name || item.roomName || 'Room',
    purchaseDate: item.checkIn,
    payment: item.paymentMethod || 'On Arrival',
    total: `Npr ${item.total || item.totalAmount}`,
    status: item.status === 'confirmed' || item.status === 'completed' ? 'Shipped out' : 
            item.status === 'cancelled' ? 'Cancelled' : 'Pending Confirmation',
    rawStatus: item.status
  }));

  const packageBookings = (bookingsData?.travelPackages || []).map(item => ({
    id: item.id,
    type: 'Travel Package',
    item: item.travelPackage?.name || item.packageName || 'Package',
    purchaseDate: item.travelDate || item.departure?.date || item.createdAt,
    payment: item.paymentMethod || 'On Departure',
    total: `Npr ${item.total || item.totalAmount || (item.travelPackage?.price * (item.travellersCount || 1))}`,
    status: item.status === 'CONFIRMED' || item.status === 'confirmed' || item.status === 'completed' ? 'Shipped out' : 
            item.status === 'cancelled' ? 'Cancelled' : 'Pending Payment Verification',
    rawStatus: item.status
  }));

  // Combine all bookings
  const allPayments = [...productBookings, ...accommodationBookings, ...packageBookings]
    .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

  // Filter bookings based on selected status
  const filteredPayments = filterStatus === 'All' 
    ? allPayments 
    : allPayments.filter(payment => payment.status === filterStatus);

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Shipped out':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Pending Payment Verification':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending Confirmation':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Show loading if query is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Handle case where userId is not available
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-6">User not authenticated</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-3">
            My Payment History
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Track all your payments for local products, travel packages, and accommodation stays in one place.
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header with Filter */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="All">All</option>
              <option value="Shipped out">Shipped out</option>
              <option value="Pending Payment Verification">Pending Payment Verification</option>
              <option value="Pending Confirmation">Pending Confirmation</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Item</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Purchase Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr 
                      key={`${payment.type}-${payment.id}`} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <ChevronRight size={16} className="text-red-500" />
                          <div>
                            <div className="font-medium text-gray-900">{payment.type}</div>
                            <div className="text-xs text-gray-500">{payment.item}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {new Date(payment.purchaseDate).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\//g, '-')}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{payment.payment}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{payment.total}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      No payment records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Refresh Button */}
          {filteredPayments.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={refetch}
                disabled={isFetching}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm transition"
              >
                {isFetching ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;