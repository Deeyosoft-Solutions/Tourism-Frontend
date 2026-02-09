// ProductBookings.js
const ProductBookings = ({ orders, isFetching, refetch }) => {
  const handleRefresh = () => {
    if (refetch) refetch();
  };

  return (
    <div className="w-full">
      {/* Refresh Button */}
      {refetch && (
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex bg-indigo-100 border-b border-indigo-200">
          <div className="w-36 px-2 py-3 font-bold text-xs text-indigo-900">Order</div>
          <div className="w-32 px-2 py-3 font-bold text-xs text-indigo-900">Buyer</div>
          <div className="w-28 px-2 py-3 font-bold text-xs text-indigo-900">Product</div>
          <div className="w-32 px-2 py-3 font-bold text-xs text-indigo-900">Payment</div>
          <div className="w-20 px-2 py-3 font-bold text-xs text-indigo-900">Items</div>
          <div className="w-28 px-2 py-3 font-bold text-xs text-indigo-900">Total</div>
          <div className="w-28 px-2 py-3 font-bold text-xs text-indigo-900">Status</div>
          <div className="w-32 px-2 py-3 font-bold text-xs text-indigo-900">Date</div>
        </div>

        {/* Table Body */}
        <div className="max-h-[270px] overflow-y-auto">
          {orders && orders.length > 0 ? (
            orders.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="w-36 px-2 py-3 text-xs text-center text-gray-900 truncate">
                  {item.code}
                </div>

                <div className="w-32 px-2 py-3 text-xs text-center text-gray-900 truncate">
                  {item.buyer.firstName} {item.buyer.lastName}
                </div>

                <div className="w-28 px-2 py-3 text-xs text-center text-gray-900 truncate">
                  {item.items.map((i) => i.productId).join(", ")}
                </div>

                <div className="w-32 px-2 py-3 text-xs text-center text-gray-900 truncate">
                  {item.paymentMethod}
                </div>

                <div className="w-20 px-2 py-3 text-xs text-center text-gray-900">
                  {item.items.length}
                </div>

                <div className="w-28 px-2 py-3 text-xs text-center text-gray-900">
                  Rs. {item.total}
                </div>

                <div className="w-28 px-2 py-3 flex justify-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-white font-semibold text-xs ${
                      item.status === "completed"
                        ? "bg-green-600"
                        : "bg-yellow-400"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <div className="w-32 px-2 py-3 text-xs text-center text-gray-900">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm">
              No processing or completed bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBookings;