import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import productsData from "../data/products.json";

export default function Invoice() {
  const location = useLocation();
  const { invoiceCartItems, invoiceCheckoutData } = location.state || {};

  const cartItems = invoiceCartItems || [];
  const checkoutData = invoiceCheckoutData || {};

  const [invoiceDate] = useState(new Date());
  const invoiceRef = useRef(null);

  // Safe price lookup
  const getPrice = (item) => {
    try {
      for (const category of productsData) {
        for (const type of category.types) {
          for (const variety of type.varieties) {
            if (variety.id === item.id) {
              const sizeOption = variety.details.sizeOptions.find(
                (so) => so.size === item.selectedSizeId
              );
              if (sizeOption) {
                console.log(
                  `DEBUG: Found price for ${item.name} size ${item.selectedSizeId}: ${sizeOption.price}`
                );
                return sizeOption.price;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetching price for item:", item, err);
    }
    return 0; // fallback if price not found
  };

  const cartItemsWithPrice = cartItems.map((item) => ({
    ...item,
    price: getPrice(item),
  }));

  // Calculate subtotal
  let subtotal = 0;
  cartItemsWithPrice.forEach((item) => {
    const pieces = (item.crateQty || 0) * (item.piecesPerCrate || 0) + (item.pieceQty || 0);
    const price = item.pricePerPiece || item.price || 0;
    const itemTotal = pieces * price;
    subtotal += itemTotal;
    console.log(
      `DEBUG: Item ${item.name} pieces: ${pieces}, price: ${price}, item total: ${itemTotal}`
    );
  });
  console.log("DEBUG: Subtotal:", subtotal);

  // Discount
  let discountRate = 0;
  if (checkoutData.tier === "Tier1") discountRate = 0.2;
  else if (checkoutData.tier === "Tier2") discountRate = 0.15;
  else if (checkoutData.tier === "Tier3") discountRate = 0.1;

  const discount = subtotal * discountRate;
  console.log("DEBUG: Discount Rate:", discountRate, "Discount Value:", discount);

  // Weight & shipping
  const FILLER_CHARGE = 30;
  const SHIPPING_FEE = 120;
  const MAX_WEIGHT = 48000;

  let totalPieces = 0;
  let totalWeight = 0;

  cartItemsWithPrice.forEach((item) => {
    const pieces = (item.crateQty || 0) * (item.piecesPerCrate || 0) + (item.pieceQty || 0);
    totalPieces += pieces;

    // Parse weight per piece
    let weightPerPiece = 0;
    if (item.weightPerPiece) {
      const match = item.weightPerPiece.toString().match(/[\d.]+/);
      weightPerPiece = match ? parseFloat(match[0]) : 0;
    }
    totalWeight += pieces * weightPerPiece;
    console.log(
      `DEBUG: Weight per piece for item ${item.name}: ${item.weightPerPiece} lbs, parsed: ${weightPerPiece}`
    );
  });

  let fillerCharge = 0;
cartItemsWithPrice.forEach((item) => {
  const pieces = (item.crateQty || 0) * (item.piecesPerCrate || 0) + (item.pieceQty || 0);
  if (pieces > 0 && pieces % item.piecesPerCrate !== 0) {
    fillerCharge += FILLER_CHARGE;
  }
});


  const shippingFee = totalWeight > MAX_WEIGHT ? 0 : SHIPPING_FEE;

  const finalTotal = subtotal - discount + fillerCharge + shippingFee;

  console.log("DEBUG: Total Pieces:", totalPieces, "Total Weight:", totalWeight);
  console.log("DEBUG: Filler:", fillerCharge, "Shipping:", shippingFee, "Final Total:", finalTotal);

  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 15);

  const handleDownloadPDF = async () => {
    console.log("DEBUG: Starting PDF generation...");
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${new Date().getTime()}.pdf`);
      console.log("DEBUG: PDF generated successfully!");
    } catch (err) {
      console.error("DEBUG: PDF generation failed:", err);
    }
  };

  return (
    <>
      
      <div
        ref={invoiceRef}
        style={{ backgroundColor: "#ffffff", color: "#111827", padding: "24px" }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>INVOICE</h1>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <p style={{ fontWeight: "bold" }}>Billed To:</p>
            <p>{checkoutData.company || "Company Name"}</p>
            <p>{checkoutData.address || "Company Address"}</p>
            <p>
              {checkoutData.city || "City"}, {checkoutData.state || "State"} -{" "}
              {checkoutData.zip || "00000"}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: "bold" }}>RRSTONES</p>
            <p>Business Address</p>
            <p>City, State, IN - 00000</p>
            <p>TAX ID: 00XXXXXXXXXXXX</p>
          </div>
        </div>

        <hr style={{ borderColor: "#9ca3af", marginBottom: "16px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <p style={{ fontWeight: "bold" }}>Invoice #</p>
            <p>AB2324-01</p>
            <p style={{ fontWeight: "bold", marginTop: "8px" }}>Invoice Date</p>
            <p>{invoiceDate.toLocaleDateString()}</p>
            <p style={{ fontWeight: "bold", marginTop: "8px" }}>Reference</p>
            <p>INV-057</p>
            <p style={{ fontWeight: "bold", marginTop: "8px" }}>Due Date</p>
            <p>{dueDate.toLocaleDateString()}</p>
          </div>

          <div style={{ width: "65%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#e5e7eb" }}>
                  <th style={{ border: "1px solid #d1d5db", padding: "4px" }}>Items Purchased</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "4px" }}>Qty</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "4px" }}>Price/pc</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "4px" }}>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItemsWithPrice.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "8px" }}>
                      No items to display
                    </td>
                  </tr>
                )}
                {cartItemsWithPrice.map((item, idx) => {
                  const pieces = (item.crateQty || 0) * (item.piecesPerCrate || 0) + (item.pieceQty || 0);
                  const price = item.pricePerPiece || item.price || 0;
                  if (pieces === 0) return null;
                  return (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #d1d5db", padding: "4px" }}>{item.name}</td>
                      <td style={{ border: "1px solid #d1d5db", padding: "4px" }}>{pieces}</td>
                      <td style={{ border: "1px solid #d1d5db", padding: "4px" }}>${price.toFixed(2)}</td>
                      <td style={{ border: "1px solid #d1d5db", padding: "4px" }}>${(pieces * price).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: "8px", textAlign: "right" }}>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Filler Charges: ${fillerCharge.toFixed(2)}</p>
              <p>Discount: -${discount.toFixed(2)}</p>
              <p>Shipping Charges: ${shippingFee.toFixed(2)}</p>
              <p style={{ fontWeight: "bold" }}>Total Due: ${finalTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          Please complete the payment within 15 days of receiving this invoice.
        </p>
      </div>

      <div style={{ padding: "24px" }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Download Invoice
        </button>
      </div>
    </>
  );
}
