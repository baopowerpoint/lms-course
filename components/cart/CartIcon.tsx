"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartContext } from "@/hooks/CartProvider";
import Cart from "./Cart";

const CartIcon = () => {
  const { getItemsCount } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const itemCount = getItemsCount();
  
  return (
    <>
      <button 
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setIsCartOpen(true)}
        aria-label="Open cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
            {itemCount}
          </span>
        )}
      </button>
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default CartIcon;
