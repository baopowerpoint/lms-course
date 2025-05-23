"use client";

import { useCartContext } from "@/hooks/CartProvider";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import CartSummary from "./CartSummary";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order.action";
import PaymentMethodSelector from "./PaymentMethodSelector";
import Duolingo from "@/components/ui/duolingo-button";

type PaymentMethod = "bank_transfer" | "momo" | null;

const CheckoutForm = () => {
  const { cart, getTotal, clearCart } = useCartContext();
  const { user } = useUser();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Handle form submission
  const handleCheckout = async () => {
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      return;
    }
    
    if (!isPaymentConfirmed) {
      setError("Vui lòng xác nhận đã hoàn tất thanh toán trước khi tiếp tục");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create an order with the selected courses and payment method
      const orderItems = cart.map((item) => ({
        courseId: item._id,
        title: item.title,
        price: item.price || 0,
      }));

      const orderData = {
        userId: user?.id as string,
        items: orderItems.map((item) => item.courseId),
        total: getTotal(),
        paymentMethod,
        status: "pending", // Orders start as pending until payment confirmation
      };

      // Create the order
      const order = await createOrder(orderData);

      // Clear the cart
      clearCart();

      // Redirect to order confirmation page
      router.push(`/checkout/confirmation/${order.data._id}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Thông tin thanh toán</h3>

          <div className="space-y-4">
            <div>
              <p className="font-medium">Họ tên</p>
              <p className="text-gray-700">
                {user?.fullName || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-700">
                {user?.primaryEmailAddress?.emailAddress || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Phương thức thanh toán</h3>

          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            onPaymentConfirmChange={(isConfirmed) => {
              // Xử lý khi người dùng xác nhận đã thanh toán
              setIsPaymentConfirmed(isConfirmed);
            }}
            order={{ total: getTotal() }}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <Duolingo
            className="w-full mt-6 py-4 text-base"
            onClick={handleCheckout}
            disabled={isSubmitting || !paymentMethod}
          >
            {isSubmitting ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐƠN HÀNG"}
          </Duolingo>
        </div>
      </div>

      <div className="md:col-span-1">
        <CartSummary cart={cart} total={getTotal()} />
      </div>
    </div>
  );
};

export default CheckoutForm;
