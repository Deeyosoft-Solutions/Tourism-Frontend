import { useEffect, useState } from "react";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import DeleteConfirmationModal from "../../DeleteModal";
import PurchaseModal from "./QrPurchaseModal";
import CODPurchaseModal from "./CODPurchaseModal";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../../../Services/cartSlice";
import ErrorMessage from "../../ErrorMessage";
import { useNavigate } from "react-router-dom";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, isError, refetch } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();

  const [products, setProducts] = useState([]);
  const [hasCheckedItems, setHasCheckedItems] = useState(false);
  const [total, setTotal] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  // We no longer need this state since we're using vendor-specific checkout
  // const [hasSelectedItems, setHasSelectedItems] = useState(false);
  const [currentVendorCheckout, setCurrentVendorCheckout] = useState(null);

  // Transform API data to match component's structure
  useEffect(() => {
    if (cartData) {
      const transformedData = transformCartData(cartData);
      setProducts(transformedData);
    }
  }, [cartData]);

  // Helper function to transform API data
  const transformCartData = (apiData) => {
    if (!apiData || !apiData.items || !Array.isArray(apiData.items)) {
      console.error("Invalid cart data structure:", apiData);
      return [];
    }

    const vendorMap = new Map();

    apiData.items.forEach((item) => {
      if (!item || !item.product) {
        console.warn("Skipping invalid cart item:", item);
        return;
      }

      const product = item.product;
      const seller = item.seller;

      const sellerId = seller?.id || "default";
      const sellerName = seller
        ? `${seller.firstName} ${seller.lastName}`
        : "Store";

      if (!vendorMap.has(sellerId)) {
        vendorMap.set(sellerId, {
          vendorId: sellerId,
          vendor: sellerName,
          items: [],
          checked: false,
        });
      }

      const vendor = vendorMap.get(sellerId);

      const safeQuantity = Math.min(item.quantity, product.stock || 0);

      vendor.items.push({
        id: item.id,
        productId: product.id,
        name: product.name,
        color: product.color || "N/A",
        quantity: safeQuantity,
        price: parseFloat(product.price),
        stock: product.stock || 0,
        checked: false,
        image: product.images?.[0] || null,
      });
    });

    return Array.from(vendorMap.values());
  };

  // Calculate total and checked items
  useEffect(() => {
    let calculatedTotal = 0;
    // Removed unused variable anyItemSelected

    products.forEach((vendor) => {
      vendor.items.forEach((item) => {
        if (item.checked) {
          calculatedTotal += item.quantity * item.price;
        }
      });
    });

    setTotal(calculatedTotal);

    const checked = products.some(
      (vendor) => vendor.checked || vendor.items.some((item) => item.checked)
    );
    setHasCheckedItems(checked);
  }, [products]);

  // Calculate subtotal for an item
  const calculateSubtotal = (item) => {
    return (item.quantity * item.price).toFixed(2);
  };

  // Calculate vendor total (for checked items only)
  const calculateVendorTotal = (vendorIndex) => {
    let vendorTotal = 0;
    const vendor = products[vendorIndex];

    vendor.items.forEach((item) => {
      if (item.checked) {
        vendorTotal += item.quantity * item.price;
      }
    });

    return vendorTotal;
  };

  // Check if vendor has any checked items
  const hasVendorCheckedItems = (vendorIndex) => {
    const vendor = products[vendorIndex];
    return vendor.items.some((item) => item.checked);
  };

  // Update quantity of an item
  const updateQuantity = async (vendorIndex, itemIndex, newQuantity) => {
    // Create a deep copy of the products array
    const updatedProducts = JSON.parse(JSON.stringify(products));
    const item = updatedProducts[vendorIndex].items[itemIndex];

    // Convert to number in case it's a string
    newQuantity = Number(newQuantity);

    // Validate new quantity
    if (isNaN(newQuantity) || newQuantity < 1) {
      return; // Exit if invalid
    }

    // Ensure quantity doesn't exceed stock
    newQuantity = Math.min(newQuantity, item.stock);

    // Don't make API call if quantity didn't change
    if (newQuantity === item.quantity) {
      return;
    }

    // Optimistic UI update
    item.quantity = newQuantity;
    setProducts(updatedProducts);

    try {
      // Use updateCart mutation
      await updateCart({
        productId: item.productId,
        quantity: newQuantity,
      });
      refetch(); // Sync with server
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Revert on error
      refetch(); // Get fresh data from server
    }
  };

  // Toggle item checkbox
  const toggleItemCheck = (vendorIndex, itemIndex) => {
    const updatedProducts = [...products];
    const item = updatedProducts[vendorIndex].items[itemIndex];
    item.checked = !item.checked;

    const vendor = updatedProducts[vendorIndex];
    vendor.checked = vendor.items.every((item) => item.checked);

    setProducts(updatedProducts);
  };

  // Toggle vendor checkbox
  const toggleVendorCheck = (vendorIndex) => {
    const updatedProducts = [...products];
    const vendor = updatedProducts[vendorIndex];
    vendor.checked = !vendor.checked;

    vendor.items.forEach((item) => {
      item.checked = vendor.checked;
    });

    setProducts(updatedProducts);
  };

  // Clear entire cart
  const handleClearCart = async () => {
    setIsClearCartModalOpen(false);
    try {
      await clearCart();
      refetch();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Prepare selected items for deletion
  const prepareDeleteCheckedItems = () => {
    const checkedItems = products.flatMap((vendor) =>
      vendor.items.filter((item) => item.checked)
    );

    if (checkedItems.length === 0) {
      console.log("No items selected");
      return;
    }

    setItemsToDelete(checkedItems);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion of selected items
  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      await Promise.all(
        itemsToDelete.map((item) => removeFromCart(item.productId))
      );
      refetch();
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  };

  // Format price with currency
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Handle checkout for a specific vendor
  const handleVendorCheckout = (vendorIndex) => {
    setCurrentVendorCheckout(vendorIndex);
    setIsPurchaseModalOpen(true);
  };

  // Get filtered cart items for the current vendor checkout
  const getCurrentVendorItems = () => {
    if (currentVendorCheckout === null) return products;

    // Return only the current vendor being checked out with only checked items
    const vendor = products[currentVendorCheckout];
    if (!vendor) return products;

    const filteredVendor = {
      ...vendor,
      items: vendor.items.filter((item) => item.checked),
    };

    return [filteredVendor];
  };

  // Get total for the current vendor checkout
  const getCurrentVendorTotal = () => {
    if (currentVendorCheckout === null) return total;
    return calculateVendorTotal(currentVendorCheckout);
  };

  // Check if cart is empty
  const isCartEmpty =
    !products ||
    products.length === 0 ||
    products.every((vendor) => vendor.items.length === 0);

  if (isLoading)
    return <div className="text-center py-10">Loading cart...</div>;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-10">
        <ErrorMessage
          message={isError?.data?.message || "Please log in to gain access !!!"}
          onRetry={() => navigate("/login")}
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-grow">
          <div className="mb-8">
            {!isCartEmpty && (
              <div className="hidden md:grid grid-cols-12 gap-4 border-black border-b pb-2 items-center mb-4">
                <div className="col-span-5 font-medium py-3">Product</div>
                <div className="col-span-2 font-medium text-center py-3">
                  Quantity
                </div>
                <div className="col-span-2 font-medium text-center py-3">
                  Price
                </div>
                <div className="col-span-2 font-medium text-center py-3">
                  Subtotal
                </div>
                <div className="col-span-1">
                  {hasCheckedItems && (
                    <button
                      onClick={prepareDeleteCheckedItems}
                      className="flex p-2 text-lg items-center gap-1 text-white rounded hover:ring-1 hover:ring-red-600"
                      title="Delete selected items"
                    >
                      <FaTrashAlt className="text-red-500" />
                    </button>
                  )}
                  {!isCartEmpty && (
                    <button
                      onClick={() => setIsClearCartModalOpen(true)}
                      className="flex p-2 text-lg items-center gap-1 text-white rounded hover:ring-1 hover:ring-red-600 mt-2"
                      title="Clear entire cart"
                    >
                      <FaShoppingCart className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              items={itemsToDelete || []}
              action="delete"
            />

            <DeleteConfirmationModal
              isOpen={isClearCartModalOpen}
              onClose={() => setIsClearCartModalOpen(false)}
              onConfirm={handleClearCart}
              action="clear"
            />

            {!isCartEmpty ? (
              products.map((vendorGroup, vendorIndex) => (
                <div
                  key={vendorGroup.vendorId}
                  className="mb-8 border rounded-lg p-4 shadow"
                >
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={vendorGroup.checked}
                      onChange={() => toggleVendorCheck(vendorIndex)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium text-yellow-500">
                      {vendorGroup.vendor}
                    </span>
                  </div>

                  {vendorGroup.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b py-4"
                    >
                      <div className="pl-2 col-span-5 flex items-center">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() =>
                            toggleItemCheck(vendorIndex, itemIndex)
                          }
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="ml-6">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-500">Color: {item.color}</p>
                          <p className="text-gray-500 text-sm">
                            Available: {item.stock}
                          </p>
                          {item.quantity > item.stock && (
                            <p className="text-red-500 text-sm">
                              Quantity exceeds available stock!
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border rounded-md">
                          <button
                            className={`px-3 py-1 text-lg ${
                              item.quantity <= 1
                                ? "text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(
                                  vendorIndex,
                                  itemIndex,
                                  item.quantity - 1
                                );
                              }
                            }}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>

                          <span className="px-3 py-1 border-x">
                            {item.quantity}
                          </span>

                          <button
                            className={`px-3 py-1 text-lg ${
                              item.quantity >= item.stock
                                ? "text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (item.quantity < item.stock) {
                                updateQuantity(
                                  vendorIndex,
                                  itemIndex,
                                  item.quantity + 1
                                );
                              }
                            }}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        {formatPrice(item.price)}
                      </div>
                      <div className="col-span-2 text-center font-medium">
                        ${calculateSubtotal(item)}
                      </div>
                    </div>
                  ))}

                  {/* Vendor checkout section */}
                  <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 border-gray-200 p-2 rounded">
                        <div className="flex items-center p-2 border border-gray-300 rounded-md hover:ring-1 hover:ring-gray-900">
                          <input
                            type="radio"
                            id={`cod-${vendorIndex}`}
                            name={`payment-${vendorIndex}`}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setSelectedPayment("cod")}
                            checked={selectedPayment === "cod"}
                          />
                          <label
                            htmlFor={`cod-${vendorIndex}`}
                            className="ml-2"
                          >
                            Cash on delivery
                          </label>
                        </div>

                        <div className="flex items-center p-2 border border-gray-300 rounded-md hover:ring-1 hover:ring-gray-900">
                          <input
                            type="radio"
                            id={`payNow-${vendorIndex}`}
                            name={`payment-${vendorIndex}`}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setSelectedPayment("payNow")}
                            checked={selectedPayment === "payNow"}
                          />
                          <label
                            htmlFor={`payNow-${vendorIndex}`}
                            className="ml-2"
                          >
                            Pay Now Through Qr
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="items-center">
                      <button
                        onClick={() => handleVendorCheckout(vendorIndex)}
                        className="bg-red-500 text-white py-2 px-8 rounded-md hover:bg-red-700 transition-colors font-medium font-Open disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          !selectedPayment ||
                          !hasVendorCheckedItems(vendorIndex)
                        }
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-gray-500">Your cart is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary Section - No checkout button */}
        <div className="lg:w-80">
          <div className="h-fit w-full p-6 border-gray-500 border rounded-lg shadow-xl bg-white">
            <h2 className="text-xl font-medium font-poppins mb-4">
              Cart summary
            </h2>

            {/* Selected items list */}
            <div className="max-h-60 overflow-y-auto mb-4">
              {products.map((vendorGroup) =>
                vendorGroup.items
                  .filter((item) => item.checked)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <span className="text-gray-700 truncate max-w-[180px]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-500">{item.price}</span>
                    </div>
                  ))
              )}
            </div>

            <div className="border-t py-4 my-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="text-lg font-semibold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPayment === "cod" ? (
        <CODPurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setCurrentVendorCheckout(null);
          }}
          cartItems={getCurrentVendorItems()}
          total={getCurrentVendorTotal()}
        />
      ) : (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setCurrentVendorCheckout(null);
          }}
          cartItems={getCurrentVendorItems()}
          total={getCurrentVendorTotal()}
        />
      )}
    </div>
  );
};

export default ShoppingCartPage;
