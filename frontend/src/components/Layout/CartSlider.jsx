import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
import SuccessModal from "./SuccessModal.jsx";

// This is the (X) icon
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// This is the Trash Can icon
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CartSlider = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    addToCart,
    removeFromCart,
    purchaseCart,
    showNotification, // Added showNotification
  } = useAuth();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIncrement = (sweetId) => {
    addToCart(sweetId, 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      addToCart(item.sweet._id, -1);
    } else {
      removeFromCart(item.sweet._id);
    }
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + (item.sweet ? item.sweet.price * item.quantity : 0),
      0
    );
  }, [cart]);

  const handlePurchaseClick = () => {
    // 1. Open the confirmation modal
    setIsConfirmOpen(true);
  };

  const handleConfirmPurchase = async () => {
    // 2. Set loading state
    setIsProcessing(true);
    try {
      // 3. Call the purchase function from context
      const data = await purchaseCart();

      // 4. On success, close modals and show success popup
      setIsConfirmOpen(false);
      setIsProcessing(false);
      //closeCart(); // Close the cart slider
      setIsSuccessOpen(true); // Show the success animation
    } catch (error) {
      // 5. On failure, show notification and close confirm modal
      setIsConfirmOpen(false);
      setIsProcessing(false);
      showNotification(
        error.response?.data?.message || "Purchase failed.",
        "error"
      );
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    closeCart();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                Your cart is empty.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  // Add a check for item.sweet to prevent crashes
                  item.sweet && (
                    <li key={item.sweet._id} className="flex py-4">
                      <img
                        src={item.sweet.imageUrl}
                        alt={item.sweet.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-grow">
                        <h4 className="font-semibold text-gray-800">
                          {item.sweet.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.sweet.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="w-8 h-8 text-lg font-bold text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.sweet._id)}
                              className="w-8 h-8 text-lg font-bold text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.sweet._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>

          {/* Footer & Purchase Button */}
          {cart.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  Subtotal:
                </span>
                <span className="text-xl font-bold text-pink-500">
                  ₹
                  {subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <button
                // --- THIS IS THE FIX ---
                // Change 'purchaseCart' to 'handlePurchaseClick'
                // to open the confirmation modal first.
                onClick={handlePurchaseClick}
                className="w-full py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
              >
                Proceed to Purchase
              </button>
            </div>
          )}
        </div>
      </div>

      {isConfirmOpen && (
        <ConfirmationModal
          title="Confirm Purchase"
          message={`Are you sure you want to purchase these items for ₹${subtotal.toLocaleString(
            "en-IN",
            { minimumFractionDigits: 2 }
          )}?`}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setIsConfirmOpen(false)}
          isLoading={isProcessing}
        />
      )}

      {isSuccessOpen && <SuccessModal onClose={handleCloseSuccess} />}
    </>
  );
};

export default CartSlider;