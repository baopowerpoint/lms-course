"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/actions/course.action";
import { useCartContext } from "@/hooks/CartProvider";
import { ShoppingCart, Check } from "lucide-react";
import Duolingo from "../ui/duolingo-button";

interface AddToCartButtonProps {
  course: Course;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  fullWidth?: boolean;
}

const AddToCartButton = ({
  course,
  variant = "default",
  size = "default",
  className = "",
  fullWidth = false,
}: AddToCartButtonProps) => {
  const { cart, addToCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);

  // Check if course is already in cart
  const isInCart = cart.some((item) => item._id === course._id);

  const handleAddToCart = () => {
    if (isInCart) return;

    setIsAdding(true);
    addToCart(course);

    // Show success animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <Duolingo
      onClick={handleAddToCart}
      disabled={isInCart || isAdding}
      className={`${className} ${fullWidth ? "w-full" : ""} transition-all`}
    >
      {isInCart ? (
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4 mr-2" />
          Đã thêm vào giỏ
        </div>
      ) : isAdding ? (
        <div className="flex items-center gap-1">
          <ShoppingCart className="w-4 h-4 mr-2 animate-bounce" />
          Đang thêm...
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm vào giỏ hàng
        </div>
      )}
    </Duolingo>
  );
};

export default AddToCartButton;
