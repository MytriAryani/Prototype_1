import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import customers from "../data/customers.json";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const FILLER_CHARGE = 30;
const SHIPPING_FEE = 120;
const MAX_WEIGHT = 48000;

export default function Cart() {
  const { cartItems } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const userTier = customers[0].tier;

  const discountRate = useMemo(() => {
    if (userTier === "Tier1") return 0.2;
    if (userTier === "Tier2") return 0.15;
    if (userTier === "Tier3") return 0.1;
    return 0;
  }, [userTier]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const pieces = item.crateQty * item.piecesPerCrate + item.pieceQty;
      return sum + pieces * item.pricePerPiece;
    }, 0);
  }, [cartItems]);

  const totalPieces = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + item.crateQty * item.piecesPerCrate + item.pieceQty;
    }, 0);
  }, [cartItems]);

  const totalWeight = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const weightNum = parseFloat(item.weightPerPiece); // ✅ FIX
      const pieces = item.crateQty * item.piecesPerCrate + item.pieceQty;
      return sum + pieces * weightNum;
    }, 0);
  }, [cartItems]);

  const discount = subtotal * discountRate;

  const hasLeftoverPieces = totalPieces % (cartItems[0]?.piecesPerCrate || 1) !== 0;
  const fillerCharge = hasLeftoverPieces ? FILLER_CHARGE : 0;
  const shippingFee = totalWeight > MAX_WEIGHT ? 0 : SHIPPING_FEE;

  const finalTotal = subtotal - discount + fillerCharge + shippingFee;

  const handleProceed = () => {
    console.log("DEBUG totalWeight:", totalWeight, cartItems);

    if (totalWeight > MAX_WEIGHT) {
      setPopupMessage(
        `⚠️ Your order weighs ${totalWeight.toLocaleString()} lbs, which exceeds the 48,000 lbs shipping limit. Shipping will not be available — you must arrange pickup. Do you still want to proceed?`
      );
    } else {
      setPopupMessage("Do you want to proceed to checkout?");
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    navigate("/checkout", { 
      state: { 
        totalWeight, 
        finalTotal, 
        pickupOnly: totalWeight > MAX_WEIGHT 
      } 
    }); // ✅ FIX
  };

  if (!cartItems.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <CartItem
                key={`${item.id}-${item.selectedSizeId}`}
                item={item}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="border p-4 rounded-lg h-fit">
            <h2 className="text-lg font-bold mb-4">Summary</h2>
            <p className="flex justify-between">
              <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Discount ({userTier}):</span>{" "}
              <span>-${discount.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Filler Charges:</span>{" "}
              <span>${fillerCharge.toFixed(2)}</span>
            </p>
            {totalWeight <= MAX_WEIGHT && (
              <p className="flex justify-between">
                <span>Shipping:</span>{" "}
                <span>${shippingFee.toFixed(2)}</span>
              </p>
            )}
            {totalWeight > MAX_WEIGHT && (
              <p className="text-red-500 text-sm mt-2">
                Weight Limit exceeded - No shipping available
              </p>
            )}
            <hr className="my-4" />
            <p className="flex justify-between font-bold">
              <span>Total:</span> <span>${finalTotal.toFixed(2)}</span>
            </p>
            <button
              onClick={handleProceed}
              className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg w-96 text-center">
              <h3 className="font-bold mb-4">Confirm Purchase</h3>
              <p className="mb-4">{popupMessage}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
