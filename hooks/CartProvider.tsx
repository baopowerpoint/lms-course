"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Course } from "@/lib/actions/course.action";
import { useCart, CartItem } from "@/hooks/useCart";

interface CartContextType {
  cart: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    getTotal, 
    getItemsCount 
  } = useCart();

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotal,
      getItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
