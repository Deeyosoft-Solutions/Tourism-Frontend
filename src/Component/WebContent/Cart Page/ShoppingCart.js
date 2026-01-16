import { useEffect, useState } from "react";
import { FaShoppingCart, FaTrashAlt, FaUpload } from "react-icons/fa";
import DeleteConfirmationModal from "../../DeleteModal";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../../../Services/cartSlice";
import ErrorMessage from "../../ErrorMessage";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../../Services/productOrder";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, isError, refetch } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  const [products, setProducts] = useState([]);
  const [hasCheckedItems, setHasCheckedItems] = useState(false);
  const [total, setTotal] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("QR");
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

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

  // Get checked items
  const getCheckedItems = () => {
    const checkedItems = [];
    products.forEach((vendor) => {
      vendor.items.forEach((item) => {
        if (item.checked) {
          checkedItems.push(item);
        }
      });
    });
    return checkedItems;
  };

  // Update quantity of an item
  const updateQuantity = async (vendorIndex, itemIndex, newQuantity) => {
    const updatedProducts = JSON.parse(JSON.stringify(products));
    const item = updatedProducts[vendorIndex].items[itemIndex];

    newQuantity = Number(newQuantity);

    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    }

    newQuantity = Math.min(newQuantity, item.stock);

    if (newQuantity === item.quantity) {
      return;
    }

    item.quantity = newQuantity;
    setProducts(updatedProducts);

    try {
      await updateCart({
        productId: item.productId,
        quantity: newQuantity,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      refetch();
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
    return `Rs. ${price.toFixed(2)}`;
  };

  // Handle receipt upload
  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    if (!cartData?.id) {
      alert("Cart ID not found");
      return;
    }

    // Get all checked items and group by seller
    const checkedItemsBySeller = {};
    products.forEach((vendor) => {
      const vendorCheckedItems = vendor.items.filter((item) => item.checked);
      if (vendorCheckedItems.length > 0) {
        checkedItemsBySeller[vendor.vendorId] = vendorCheckedItems;
      }
    });

    if (Object.keys(checkedItemsBySeller).length === 0) {
      alert("Please select items to order");
      return;
    }

    if (selectedPayment === "QR" && !receiptImage) {
      alert("Please upload payment receipt for QR payment");
      return;
    }

    try {
      // Create orders for each seller
      for (const [sellerId, items] of Object.entries(checkedItemsBySeller)) {
        const formData = new FormData();
        formData.append("cartId", cartData.id);
        formData.append("sellerId", sellerId);

        items.forEach((item) => {
          formData.append("selectedItemIds[]", item.id);
        });

        formData.append("paymentMethod", selectedPayment);

        if (selectedPayment === "QR" && receiptImage) {
          formData.append("receiptImage", receiptImage);
        }

        await createOrder(formData).unwrap();
      }

      alert("Order placed successfully!");
      setReceiptImage(null);
      setReceiptPreview(null);
      refetch();
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to place order. Please try again.");
    }
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-500 mb-2">My Cart</h1>
        <p className="text-gray-600">
          Review your selected products and proceed to checkout when you're
          ready
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            placeholder="Search Products In Cart..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items Section */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {!isCartEmpty && (
              <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 p-4 bg-gray-50">
                <div className="col-span-5 font-semibold">Product</div>
                <div className="col-span-2 font-semibold text-center">
                  Quantity
                </div>
                <div className="col-span-2 font-semibold text-center">Rate</div>
                <div className="col-span-2 font-semibold text-center">
                  Subtotal
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  {hasCheckedItems && (
                    <button
                      onClick={prepareDeleteCheckedItems}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      title="Delete selected items"
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                  {!isCartEmpty && (
                    <button
                      onClick={() => setIsClearCartModalOpen(true)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      title="Clear entire cart"
                    >
                      <FaShoppingCart />
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
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center p-4 bg-gray-50">
                    <input
                      type="checkbox"
                      checked={vendorGroup.checked}
                      onChange={() => toggleVendorCheck(vendorIndex)}
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <FaShoppingCart className="text-red-500 mr-2" />
                    <span className="font-medium text-red-500">
                      {vendorGroup.vendor}
                    </span>
                  </div>

                  {vendorGroup.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() =>
                            toggleItemCheck(vendorIndex, itemIndex)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                        />
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Color: {item.color}
                          </p>
                          <button
                            onClick={async () => {
                              try {
                                await removeFromCart(item.productId);
                                refetch();
                              } catch (error) {
                                console.error("Failed to remove item:", error);
                              }
                            }}
                            className="text-xs text-red-500 hover:underline"
                          >
                            × Remove
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            className={`px-3 py-1 ${
                              item.quantity <= 1
                                ? "text-gray-300"
                                : "text-gray-700"
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
                          <span className="px-4 py-1 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            className={`px-3 py-1 ${
                              item.quantity >= item.stock
                                ? "text-gray-300"
                                : "text-gray-700"
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

                      <div className="col-span-2 text-center font-medium">
                        {formatPrice(item.price)}
                      </div>
                      <div className="col-span-2 text-center font-semibold">
                        ${calculateSubtotal(item)}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Your cart is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Price Details Section */}
        <div className="lg:w-[300px]">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Price Details</h2>

            {/* Selected items list */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {getCheckedItems().map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {getCheckedItems().length === 0 && (
                <p className="text-gray-400 text-sm">No items selected</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="QR"
                    checked={selectedPayment === "QR"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="h-4 w-4 text-red-500 focus:ring-red-500"
                  />
                  <span className="ml-3">QR Payment</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={selectedPayment === "COD"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="h-4 w-4 text-red-500 focus:ring-red-500"
                  />
                  <span className="ml-3">Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Payment Receipt Upload */}
            {selectedPayment === "QR" && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Payment Receipt</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  {receiptPreview ? (
                    <div className="relative">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        onClick={() => {
                          setReceiptImage(null);
                          setReceiptPreview(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full hover:bg-red-600 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <FaUpload className="text-3xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 mb-1">
                        Upload Receipt
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Confirm Order Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={
                !hasCheckedItems ||
                isOrderLoading ||
                (selectedPayment === "QR" && !receiptImage)
              }
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isOrderLoading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
