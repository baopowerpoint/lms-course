"use client";

import { Course } from "@/lib/actions/course.action";
import { useState, useEffect } from "react";

export type CartItem = Course & {
  quantity: number;
};

const CART_STORAGE_KEY = "lms_cart";

// Function to get cart from localStorage
const getStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
    return [];
  }
};

// Function to update cart in localStorage
const updateStoredCart = (cart: CartItem[]) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to update cart in localStorage:", error);
  }
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getStoredCart());
    setMounted(true);
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (mounted) {
      updateStoredCart(cart);
    }
  }, [cart, mounted]);

  // Add course to cart
  const addToCart = (course: Course) => {
    setCart((prevCart) => {
      // Check if course already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item._id === course._id);
      
      if (existingItemIndex >= 0) {
        // Course already in cart - don't add duplicate courses
        return prevCart;
      }
      
      // Add new course to cart with quantity 1
      return [...prevCart, { ...course, quantity: 1 }];
    });
  };

  // Remove course from cart
  const removeFromCart = (courseId: string) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== courseId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get total price of cart
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  };

  // Get number of items in cart
  const getItemsCount = () => {
    return cart.length;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotal,
    getItemsCount,
  };
};
