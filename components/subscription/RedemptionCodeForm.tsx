"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redeemCode } from "@/lib/actions/redemption-code.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  AlertCircle, 
  CheckCircle, 
  KeyIcon, 
  Loader2, 
  LockOpen, 
  TicketIcon, 
  XCircle 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RedemptionCodeForm() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formattedCode, setFormattedCode] = useState("");
  const router = useRouter();

  // Format the code for display with proper spacing
  useEffect(() => {
    const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (normalizedCode.length <= 10) {
      // Format as XX-XXXX-XXXX when typing (for easier reading)
      let formatted = normalizedCode;
      if (normalizedCode.length > 2) {
        formatted = normalizedCode.slice(0, 2) + "-" + normalizedCode.slice(2);
      }
      if (normalizedCode.length > 6) {
        formatted = formatted.slice(0, 7) + "-" + formatted.slice(7);
      }
      setFormattedCode(formatted);
    }
  }, [code]);

  // Clear error message when user starts typing
  useEffect(() => {
    if (error) setError(null);
  }, [code]);

  const validateCode = (input: string) => {
    const normalizedCode = input.toUpperCase().trim().replace(/[^A-Z0-9]/g, "");
    
    if (!normalizedCode) {
      return "Vui lòng nhập mã kích hoạt";
    }
    
    if (normalizedCode.length !== 10) {
      return `Mã kích hoạt phải có đủ 10 ký tự (hiện tại có ${normalizedCode.length} ký tự)`;
    }
    
    if (!/^[A-Z0-9]{10}$/.test(normalizedCode)) {
      return "Mã kích hoạt chỉ chứa chữ cái và số";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Normalize the code: uppercase and remove non-alphanumeric characters
    const normalizedCode = code.toUpperCase().trim().replace(/[^A-Z0-9]/g, "");
    
    // Validate the code
    const validationError = validateCode(normalizedCode);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await redeemCode(normalizedCode);
      
      if (!response.success) {
        const errorMessage = response.error || "Không thể kích hoạt mã. Vui lòng thử lại.";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      // Success!
      setSuccess(true);
      setError(null);
      toast.success("Kích hoạt mã thành công! Bạn đã được cấp quyền truy cập vào tất cả khóa học.");
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/dashboard/courses");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error redeeming code:", error);
      setError("Đã xảy ra lỗi khi kích hoạt mã. Vui lòng thử lại sau.");
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
          <div className={`p-3 rounded-full ${success ? 'bg-green-100' : error ? 'bg-red-100' : 'bg-primary/10'}`}>
            {success ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : error ? (
              <AlertCircle className="h-8 w-8 text-red-500" />
            ) : (
              <KeyIcon className="h-8 w-8 text-primary" />
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">
          {success ? 'Kích hoạt thành công!' : 'Kích hoạt mã khóa học'}
        </h2>
        
        {success ? (
          <p className="text-green-600 text-center mb-6 font-medium">
            Bạn đã được cấp quyền truy cập vào tất cả khóa học
          </p>
        ) : (
          <p className="text-muted-foreground text-center mb-6">
            Nhập mã 10 ký tự từ phong bì bạn đã mua để mở khóa toàn bộ khóa học
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4 border-red-400">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Lỗi kích hoạt mã</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="redemptionCode"
                  type="text"
                  placeholder="Nhập mã kích hoạt (VD: AB-CDEF-XYZ9)"
                  value={formattedCode}
                  onChange={(e) => {
                    // Keep only alphanumeric characters and limit to 10 chars without counting dashes
                    const rawValue = e.target.value.replace(/-/g, "");
                    const sanitized = rawValue.replace(/[^A-Za-z0-9]/g, "").slice(0, 10);
                    setCode(sanitized);
                  }}
                  className={`text-center tracking-widest py-6 text-lg placeholder:text-sm placeholder:tracking-normal uppercase font-medium ${error ? 'border-red-300 focus:border-red-500' : 'border-2'}`}
                  autoComplete="off"
                  required
                  disabled={isSubmitting}
                />
                <TicketIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${error ? 'text-red-400' : 'text-muted-foreground'}`} />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Mã có 10 ký tự gồm chữ cái và số, không phân biệt chữ hoa/thường
              </p>
            </div>

            <Button
              type="submit"
              className={`w-full py-6 ${error ? 'bg-red-500 hover:bg-red-600' : ''}`}
              disabled={isSubmitting || code.length < 3}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : error ? (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Thử lại
                </>
              ) : (
                <>
                  <LockOpen className="mr-2 h-4 w-4" />
                  Kích hoạt mã
                </>
              )}
            </Button>
            
            {code.length > 0 && code.length < 10 && !error && (
              <div className="mt-2 text-center text-amber-600 text-sm">
                <span className="font-medium">Còn thiếu {10 - code.length} ký tự</span>
              </div>
            )}
          </form>
        )}

        {success ? (
          <div className="mt-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Kích hoạt thành công!</AlertTitle>
              <AlertDescription className="text-green-700">
                Bạn đã được cấp quyền truy cập vào tất cả các khóa học của chúng tôi.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={() => router.push('/dashboard/courses')} 
                className="px-6 text-lg"
              >
                Xem các khóa học của bạn
              </Button>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
