import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import customers from "../data/customers.json";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const weightLimit = 48000;

  const [totalWeight, setTotalWeight] = useState(0);
  const [shippingAvailable, setShippingAvailable] = useState(true);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  // --- Calculate total weight ---
  useEffect(() => {
    let weight = 0;

    cartItems.forEach(item => {
      const crateQty = item.crateQty || 0;
      const pieceQty = item.pieceQty || 0;
      const piecesPerCrate = item.piecesPerCrate || 0;

      let weightPerPiece = 0;
      if (item.weightPerPiece) {
        const match = item.weightPerPiece.toString().match(/[\d.]+/);
        weightPerPiece = match ? parseFloat(match[0]) : 0;
      }

      weight += (crateQty * piecesPerCrate + pieceQty) * weightPerPiece;
    });

    console.log("DEBUG: Cart Items:", cartItems);
    console.log("DEBUG: Total Weight:", weight);

    setTotalWeight(weight);
    setShippingAvailable(weight <= weightLimit);
  }, [cartItems]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("DEBUG: Logged in User:", user);

    const customer = customers.find(c => c.username === user?.username);
    console.log("DEBUG: Customer from JSON:", customer);

    const tier = customer?.tier || "Tier1";
    console.log("DEBUG: Tier selected:", tier);

    const invoiceData = { ...form, tier };
    console.log("DEBUG: Checkout Data sent to Invoice:", invoiceData);
    console.log("DEBUG: Cart Items sent to Invoice:", cartItems);

    navigate("/invoice", {
      state: {
        invoiceCartItems: cartItems,
        invoiceCheckoutData: invoiceData
      }
    });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <p className="mb-2 font-semibold">Total Weight: {totalWeight.toLocaleString()} lbs</p>

      {!shippingAvailable && (
        <p className="text-red-500 mb-4">
          ⚠️ Your order exceeds {weightLimit.toLocaleString()} lbs. Shipping is not available. Please provide contact info only.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name*</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Company Name*</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Phone*</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {shippingAvailable && (
          <>
            <h2 className="text-lg font-semibold mt-4">Shipping Address</h2>
            <div>
              <label className="block mb-1">Street Address*</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">City*</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">State/Province*</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">ZIP/Postal Code*</label>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Country*</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}
