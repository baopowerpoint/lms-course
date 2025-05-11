"use client";

import { CartItem } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { BookOpen } from "lucide-react";

interface CartSummaryProps {
  cart: CartItem[];
  total: number;
}

const CartSummary = ({ cart, total }: CartSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4">Thông tin đơn hàng</h3>
      
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div key={item._id} className="flex gap-3 pb-4 border-b">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
              {item.image ? (
                <Image 
                  src={item.image} 
                  alt={item.title}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="font-medium line-clamp-1">{item.title}</p>
              {item.category && (
                <p className="text-xs text-gray-500">{item.category.name}</p>
              )}
              <p className="text-sm font-medium text-primary mt-1">
                {item.price ? formatPrice(item.price) : "Miễn phí"}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between py-2">
          <p className="text-sm text-gray-600">Tạm tính</p>
          <p className="text-sm font-medium">{formatPrice(total)}</p>
        </div>
        
        <div className="flex justify-between py-2">
          <p className="text-sm text-gray-600">Thuế</p>
          <p className="text-sm font-medium">0 ₫</p>
        </div>
        
        <div className="flex justify-between py-2 text-lg font-bold mt-2 border-t">
          <p>Tổng cộng</p>
          <p className="text-primary">{formatPrice(total)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
