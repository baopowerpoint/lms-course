"use client";

import { Button } from "@/components/ui/button";
import { Order, getOrderById } from "@/lib/actions/order.action";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderConfirmationPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (params.orderId) {
          const orderData = await getOrderById(params.orderId as string);
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  // Redirect if order not found
  useEffect(() => {
    if (!loading && !order) {
      router.push("/courses");
    }
  }, [order, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return null; // Will redirect via useEffect
  }

  const isPending = order.status === "pending";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
            {isPending ? (
              <Clock className="w-8 h-8 text-primary" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isPending ? "Đặt hàng thành công!" : "Thanh toán hoàn tất!"}
          </h1>
          <p className="text-gray-600 mb-4">
            {isPending
              ? "Chúng tôi đã nhận được đơn hàng của bạn và đang chờ xác nhận thanh toán."
              : "Đơn hàng của bạn đã được xác nhận và kích hoạt."}
          </p>
          <p className="font-medium">
            Mã đơn hàng: <span className="text-primary">{order.id}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Các khóa học</h3>
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item} className="py-3 flex justify-between">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Thuế</span>
                  <span>0 ₫</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                <p>
                  {order.paymentMethod === "bank_transfer"
                    ? "Chuyển khoản ngân hàng"
                    : "Ví điện tử MoMo"}
                </p>

                {isPending && order.paymentMethod === "bank_transfer" && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm">
                    <p className="font-medium mb-2">Thông tin chuyển khoản:</p>
                    <p className="mb-1">
                      Ngân hàng:{" "}
                      <span className="font-medium">Vietcombank</span>
                    </p>
                    <p className="mb-1">
                      Số tài khoản:{" "}
                      <span className="font-medium">1234567890</span>
                    </p>
                    <p className="mb-1">
                      Chủ tài khoản:{" "}
                      <span className="font-medium">
                        CÔNG TY CỔ PHẦN HAVAMATH
                      </span>
                    </p>
                    <p className="mb-1">
                      Chi nhánh:{" "}
                      <span className="font-medium">Hồ Chí Minh</span>
                    </p>
                    <p className="mb-1 text-red-600">
                      <span className="font-medium">
                        Nội dung chuyển khoản:
                      </span>{" "}
                      {order.id}
                    </p>
                  </div>
                )}

                {isPending && order.paymentMethod === "momo" && (
                  <div className="mt-4 p-4 bg-pink-50 rounded-lg text-sm">
                    <p className="font-medium mb-2">
                      Thông tin thanh toán MoMo:
                    </p>
                    <p className="mb-1">
                      Số điện thoại:{" "}
                      <span className="font-medium">0909 123 456</span>
                    </p>
                    <p className="mb-1">
                      Tên tài khoản:{" "}
                      <span className="font-medium">
                        CÔNG TY CỔ PHẦN HAVAMATH
                      </span>
                    </p>
                    <p className="mb-1 text-red-600">
                      <span className="font-medium">Nội dung chuyển tiền:</span>{" "}
                      {order.id}
                    </p>
                  </div>
                )}

                {isPending && (
                  <p className="mt-4 text-sm text-gray-600">
                    Vui lòng hoàn tất thanh toán trong vòng 24 giờ. Sau khi xác
                    nhận thanh toán, khóa học sẽ được kích hoạt và bạn có thể
                    truy cập ngay.
                  </p>
                )}

                {!isPending && (
                  <p className="mt-4 text-sm text-green-600 font-medium">
                    Thanh toán đã được xác nhận. Bạn có thể truy cập khóa học
                    ngay bây giờ.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/courses">Tiếp tục mua sắm</Link>
          </Button>

          {!isPending && (
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/courses">Xem khóa học của tôi</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
