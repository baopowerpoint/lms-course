"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redeemCode } from "@/lib/actions/redemption-code.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { KeyIcon, Loader2, LockOpen, TicketIcon } from "lucide-react";

export default function RedemptionCodeForm() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã kích hoạt");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await redeemCode(code);
      
      if (!response.success) {
        toast.error(response.error || "Không thể kích hoạt mã. Vui lòng thử lại.");
        return;
      }
      
      toast.success("Kích hoạt mã thành công! Bạn đã được cấp quyền truy cập vào tất cả khóa học.");
      router.push("/dashboard/courses");
      router.refresh();
    } catch (error) {
      console.error("Error redeeming code:", error);
      toast.error("Đã xảy ra lỗi khi kích hoạt mã");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-auto relative overflow-hidden border-2 border-primary/20">
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/10 rounded-full" />
      
      <div className="relative">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <KeyIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Kích hoạt mã khóa học</h2>
        <p className="text-muted-foreground text-center mb-6">
          Nhập mã 10 ký tự từ phong bì bạn đã mua để mở khóa toàn bộ khóa học
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="redemptionCode"
                type="text"
                placeholder="Nhập mã kích hoạt (VD: ABC123XYZ9)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center tracking-widest py-6 text-lg placeholder:text-sm placeholder:tracking-normal uppercase border-2 font-medium"
                maxLength={10}
                required
              />
              <TicketIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Mã có 10 ký tự gồm chữ cái và số, không phân biệt chữ hoa/thường
            </p>
          </div>

          <Button
            type="submit"
            className="w-full py-6"
            disabled={isSubmitting || !code.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <LockOpen className="mr-2 h-4 w-4" />
                Kích hoạt mã
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
          <div className="bg-amber-50 p-4 rounded-lg text-sm">
            <h3 className="font-semibold text-amber-800 mb-1">Hướng dẫn:</h3>
            <ol className="list-decimal list-inside space-y-1 text-amber-700">
              <li>Nhập chính xác mã 10 ký tự từ phong bì đã mua</li>
              <li>Mỗi mã chỉ có thể sử dụng một lần</li>
              <li>Sau khi kích hoạt thành công, bạn sẽ có quyền truy cập vào tất cả khóa học</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
