"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/hooks/CartProvider";
import { formatPrice } from "@/lib/utils";
import { UserRound } from "lucide-react";
import Link from "next/link";
import CartSummary from "./CartSummary";

const CheckoutAuthRequired = () => {
  const { cart, getTotal } = useCartContext();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Đăng nhập để tiếp tục</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Bạn cần đăng nhập hoặc đăng ký tài khoản để tiến hành thanh toán và truy cập khóa học
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/sign-in?redirect_url=/checkout">
                Đăng nhập
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-up?redirect_url=/checkout">
                Đăng ký
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-1">
        <CartSummary cart={cart} total={getTotal()} />
      </div>
    </div>
  );
};

export default CheckoutAuthRequired;
