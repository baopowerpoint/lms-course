"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { useCartContext } from "@/hooks/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Duolingo from "../ui/duolingo-button";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cart, removeFromCart, clearCart, getTotal, getItemsCount } =
    useCartContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Cart panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl sm:w-[400px]">
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Giỏ hàng ({getItemsCount()})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Đóng giỏ hàng"
            title="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">Giỏ hàng trống</p>
            <p className="text-gray-500 mb-6">
              Thêm khóa học vào giỏ hàng để tiến hành thanh toán.
            </p>
            <Button variant="outline" onClick={onClose} className="px-6">
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 py-4 border-b">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium line-clamp-2">
                        <Link href={`/courses/${item.slug}`} onClick={onClose}>
                          {item.title}
                        </Link>
                      </h3>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.category && (
                      <p className="mt-1 text-xs text-gray-500">
                        {item.category.name}
                      </p>
                    )}

                    <div className="mt-auto pt-2">
                      <p className="text-sm font-medium text-primary">
                        {item.price ? formatPrice(item.price) : "Miễn phí"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between py-2">
                <p className="text-sm text-gray-600">Tạm tính</p>
                <p className="text-sm font-medium">{formatPrice(getTotal())}</p>
              </div>
              <div className="flex justify-between py-2">
                <p className="text-sm text-gray-600">Thuế</p>
                <p className="text-sm font-medium">0 ₫</p>
              </div>
              <div className="flex justify-between py-2 text-lg font-semibold">
                <p>Tổng cộng</p>
                <p>{formatPrice(getTotal())}</p>
              </div>

              <div className="mt-6 space-y-3">
                <Duolingo className="w-full">
                  <Link href="/checkout" onClick={onClose}>
                    Thanh toán
                  </Link>
                </Duolingo>
                <Duolingo
                  className="w-full"
                  variant="destructive"
                  onClick={clearCart}
                >
                  Xóa giỏ hàng
                </Duolingo>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
