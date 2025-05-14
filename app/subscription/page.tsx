import { Metadata } from "next";
import { checkUserPayment } from "@/lib/actions/payment.actions";
import SubscriptionForm from "@/components/subscription/SubscriptionForm";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng ký học | TECHSCHOOL",
  description: "Đăng ký gói truy cập vào tất cả các khóa học",
};

const SUBSCRIPTION_PRICE = 1200000; // 1,200,000 VNĐ

export default async function SubscriptionPage() {
  // Kiểm tra người dùng đã thanh toán chưa
  const paymentResult = await checkUserPayment();
  
  // Nếu đã thanh toán thành công, hiển thị thông báo và liên kết đến khóa học
  if (paymentResult.success && paymentResult.data?.hasPaid) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bạn đã đăng ký thành công!</h1>
          <p className="text-gray-600 mt-2">
            Bạn đã thanh toán {formatPrice(paymentResult.data.amount)} và có thể truy cập tất cả các khóa học.
          </p>
        </div>
        
        <div className="mt-8 border-t pt-8">
          <h2 className="text-lg font-semibold mb-4">Quyền lợi của bạn</h2>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
              <span>Truy cập không giới hạn vào tất cả các khóa học</span>
            </li>
            <li className="flex items-center text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
              <span>Cập nhật miễn phí khi có khóa học mới</span>
            </li>
            <li className="flex items-center text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
              <span>Hỗ trợ kỹ thuật từ đội ngũ giảng viên</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-center mt-8">
          <Link 
            href="/dashboard/courses"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Xem danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Đăng ký học tại TECHSCHOOL</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Một lần thanh toán, truy cập toàn bộ khóa học. Không có phí ẩn, không có phí định kỳ.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Gói truy cập đầy đủ</h2>
            <div className="mb-4">
              <span className="text-4xl font-bold">{formatPrice(SUBSCRIPTION_PRICE)}</span>
              <span className="text-gray-500 ml-2">một lần duy nhất</span>
            </div>
            
            <div className="border-t border-b py-4 my-6">
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  <span>Truy cập tất cả khóa học hiện tại và sắp ra mắt</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  <span>Không giới hạn thời gian truy cập</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  <span>Hỗ trợ từ đội ngũ giảng viên</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  <span>Cập nhật nội dung thường xuyên</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  <span>Tài liệu học tập và code mẫu</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <SubscriptionForm price={SUBSCRIPTION_PRICE} />
        </div>
      </div>
    </div>
  );
}
