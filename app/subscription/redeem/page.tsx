import { Metadata } from "next";
import RedemptionCodeForm from "@/components/subscription/RedemptionCodeForm";
import { KeyIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Kích hoạt mã - TechSchool",
  description: "Kích hoạt mã khóa học từ phong bì đã mua để mở khóa toàn bộ khóa học",
};

export default function RedeemCodePage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center justify-center gap-2">
          <KeyIcon className="h-8 w-8 text-primary" />
          <span>Kích hoạt mã khóa học</span>
        </h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Mở khóa tất cả các khóa học với mã từ phong bì bạn đã mua
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <RedemptionCodeForm />
      </div>

      <div className="mt-16 bg-accent/30 p-6 rounded-xl max-w-2xl mx-auto">
        <h2 className="font-semibold text-lg mb-3">Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Mã kích hoạt là gì?</h3>
            <p className="text-muted-foreground">
              Mã kích hoạt là mã 10 ký tự được cung cấp trong phong bì khi bạn mua khóa học thông qua đối tác phân phối. 
              Mã này cho phép bạn truy cập vào toàn bộ nội dung khóa học.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Mã kích hoạt có thời hạn sử dụng không?</h3>
            <p className="text-muted-foreground">
              Mã kích hoạt thường không có thời hạn sử dụng, nhưng mỗi mã chỉ có thể được sử dụng một lần và chỉ cho một tài khoản.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Tôi cần hỗ trợ về mã kích hoạt</h3>
            <p className="text-muted-foreground">
              Nếu bạn gặp vấn đề với mã kích hoạt, vui lòng liên hệ với chúng tôi qua email support@techschool.vn hoặc hotline 1900xxxx.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
