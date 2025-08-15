/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [checkoutData, setCheckoutData] = useState(null);

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item) {
    setCartItems(prev => {
      const existing = prev.find(
        p => p.id === item.id && p.selectedSizeId === item.selectedSizeId
      );
      if (existing) {
        return prev.map(p =>
          p.id === item.id && p.selectedSizeId === item.selectedSizeId
            ? { ...p, crateQty: p.crateQty + item.crateQty, pieceQty: p.pieceQty + item.pieceQty }
            : p
        );
      }
      return [...prev, item];
    });
  }

  function removeFromCart(productId, sizeId) {
    setCartItems(prev => prev.filter(p => !(p.id === productId && p.selectedSizeId === sizeId)));
  }

  function updateQuantity(productId, sizeId, crateQty, pieceQty) {
    setCartItems(prev =>
      prev.map(p =>
        p.id === productId && p.selectedSizeId === sizeId
          ? { ...p, crateQty, pieceQty }
          : p
      )
    );
  }

  function saveCheckoutData(data) {
    setCheckoutData(data);
  }

  function clearCart() {
    setCartItems([]);
    setCheckoutData(null);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        checkoutData,
        saveCheckoutData,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
