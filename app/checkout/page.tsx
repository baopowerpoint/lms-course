"use client";

import { useCartContext } from "@/hooks/CartProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutAuthRequired from "@/components/checkout/CheckoutAuthRequired";

const CheckoutPage = () => {
  const { cart, getTotal } = useCartContext();
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/courses");
    }
  }, [cart, router]);

  if (cart.length === 0) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-3xl font-bold">Thanh toán</h1>
          <p className="text-gray-600">
            Hoàn tất đơn hàng để truy cập các khóa học của bạn
          </p>
        </div>

        {/* Show different UI for signed-in and signed-out users */}
        <SignedIn>
          <CheckoutForm />
        </SignedIn>

        <SignedOut>
          <CheckoutAuthRequired />
        </SignedOut>
      </div>
    </div>
  );
};

export default CheckoutPage;
