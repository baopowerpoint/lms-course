"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPayment } from "@/lib/actions/payment.actions";
import { getAllCourseIds } from "@/lib/actions/course.action";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { BanknoteIcon, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubscriptionFormProps {
  price: number;
}

export default function SubscriptionForm({ price }: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "momo">("bank_transfer");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Lấy danh sách tất cả các ID khóa học
      const coursesResponse = await getAllCourseIds();
      if (!coursesResponse.success || !coursesResponse.data?.length) {
        toast.error("Không thể tải thông tin khóa học");
        return;
      }
      
      const courseIds = coursesResponse.data;

      // Tạo thanh toán mới và tự động đăng ký tất cả khóa học
      const paymentResponse = await createPayment(price, paymentMethod, courseIds);
      if (!paymentResponse.success) {
        toast.error("Không thể xử lý thanh toán");
        return;
      }

      // Chuyển đến trang dashboard sau khi thanh toán thành công
      toast.success("Thanh toán đã được xử lý thành công!");
      router.push(`/dashboard/courses`);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Phương thức thanh toán</h2>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="bank_transfer" className="w-full" onValueChange={(value) => setPaymentMethod(value as "bank_transfer" | "momo")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bank_transfer">Chuyển khoản ngân hàng</TabsTrigger>
            <TabsTrigger value="momo">MoMo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank_transfer">
            <div className="border p-4 rounded-md mb-6 bg-blue-50">
              <div className="flex items-center mb-3">
                <BanknoteIcon className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Thông tin chuyển khoản</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Ngân hàng:</span> Vietcombank</p>
                <p><span className="font-medium">Số tài khoản:</span> 1234567890</p>
                <p><span className="font-medium">Tên tài khoản:</span> TECHSCHOOL</p>
                <p><span className="font-medium">Số tiền:</span> {formatPrice(price)}</p>
                <p><span className="font-medium">Nội dung:</span> TSCHOOL [Email của bạn]</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="momo">
            <div className="border p-4 rounded-md mb-6 bg-pink-50">
              <div className="flex items-center mb-3">
                <CreditCard className="h-5 w-5 text-pink-600 mr-2" />
                <h3 className="font-semibold text-pink-800">Thông tin thanh toán MoMo</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Số điện thoại:</span> 0987654321</p>
                <p><span className="font-medium">Tên tài khoản:</span> TECHSCHOOL</p>
                <p><span className="font-medium">Số tiền:</span> {formatPrice(price)}</p>
                <p><span className="font-medium">Nội dung:</span> TSCHOOL [Email của bạn]</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mb-6">
          <Label htmlFor="email" className="block mb-2">
            Email liên hệ
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your-email@example.com"
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Chúng tôi sẽ liên hệ qua email này khi thanh toán được xác nhận.
          </p>
        </div>

        <div className="mb-6">
          <Label htmlFor="phone" className="block mb-2">
            Số điện thoại
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0901234567"
            className="w-full"
          />
        </div>

        <div className="mt-8">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận đăng ký"}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Bằng cách xác nhận, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
        </p>
      </form>
    </div>
  );
}
