"use client";

import { Button } from "@/components/ui/button";
import { checkUserPayment } from "@/lib/actions/payment.actions";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PaymentData {
  hasPaid: boolean;
  paymentId?: string;
  amount?: number;
  date?: string;
}

export default function SubscriptionStatus() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const result = await checkUserPayment();
        if (result.success && result.data) {
          setPaymentData({
            hasPaid: result.data.hasPaid || false,
            paymentId: result.data.paymentId,
            amount: result.data.amount,
            date: result.data.date
          });
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="h-20 flex items-center justify-center">
          <div className="animate-pulse w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-gray-600">Không thể tải thông tin thanh toán</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Trạng thái đăng ký</h2>
      
      {paymentData.hasPaid ? (
        <div>
          <div className="flex items-center space-x-3 text-green-700 bg-green-50 rounded-md p-3 mb-4">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Đã đăng ký gói truy cập đầy đủ</p>
              {paymentData.amount && (
                <p className="text-sm text-green-600">
                  Đã thanh toán {formatPrice(paymentData.amount)}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <Link href="/dashboard/courses">
              <Button className="w-full">
                Truy cập khóa học
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center space-x-3 text-yellow-700 bg-yellow-50 rounded-md p-3 mb-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">Bạn chưa đăng ký gói truy cập</p>
          </div>
          
          <div className="mt-6">
            <Link href="/subscription">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Đăng ký ngay
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Thanh toán một lần, truy cập không giới hạn tất cả khóa học.
          </p>
        </div>
      )}
    </div>
  );
}
