"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { checkUserPayment, checkCourseAccess } from "@/lib/actions/payment.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, LockIcon } from "lucide-react";

interface AccessButtonProps {
  courseId: string;
  courseSlug: string;
}

export default function AccessButton({ courseId, courseSlug }: AccessButtonProps) {
  const [paymentStatus, setPaymentStatus] = useState<{
    hasPaid: boolean;
    isPending: boolean;
    isLoading: boolean;
  }>({
    hasPaid: false,
    isPending: false,
    isLoading: true,
  });
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Kiểm tra trạng thái thanh toán - bao gồm cả trạng thái đang chờ duyệt
        const paymentResult = await checkUserPayment();
        
        if (paymentResult.success) {
          // Đã thanh toán và được admin duyệt
          const hasPaid = paymentResult.data?.hasPaid || false;
          // Thanh toán đang chờ duyệt
          const isPending = paymentResult.data?.status === "pending";
          
          setPaymentStatus({
            hasPaid,
            isPending,
            isLoading: false,
          });

          // Nếu đã thanh toán và được duyệt, kiểm tra quyền truy cập khóa học
          if (hasPaid) {
            // Với hệ thống đơn giản hóa, bất kỳ người dùng nào đã thanh toán đều có quyền truy cập
            // Vì vậy chỉ cần set hasAccess = true
            setHasAccess(true);
          }
        } else {
          setPaymentStatus({
            hasPaid: false,
            isPending: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error checking access:", error);
        setPaymentStatus({
          hasPaid: false,
          isPending: false,
          isLoading: false,
        });
      }
    };

    checkAccess();
  }, [courseId]);

  const handleAccess = async () => {
    if (paymentStatus.hasPaid) {
      // Nếu đã thanh toán và được duyệt, cho phép truy cập khóa học ngay
      router.push(`/dashboard/courses/${courseSlug}/learn`);
    } else if (paymentStatus.isPending) {
      // Nếu thanh toán đang chờ duyệt, hiển thị thông báo
      toast.info("Đơn hàng của bạn đang chờ admin duyệt. Vui lòng kiểm tra lại sau.");
    } else {
      // Chưa thanh toán, chuyển đến trang subscription
      router.push("/subscription");
    }
  };

  if (paymentStatus.isLoading) {
    return (
      <Button disabled className="w-full">
        Đang tải...
      </Button>
    );
  }

  if (hasAccess) {
    return (
      <Button onClick={handleAccess} className="w-full bg-green-600 hover:bg-green-700">
        <LogIn className="w-4 h-4 mr-2" />
        Vào học ngay
      </Button>
    );
  }
  
  if (paymentStatus.isPending) {
    return (
      <Button disabled className="w-full bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed opacity-80">
        Đang chờ duyệt thanh toán
      </Button>
    );
  }

  if (paymentStatus.hasPaid) {
    return (
      <Button onClick={handleAccess} className="w-full bg-blue-600 hover:bg-blue-700">
        <LogIn className="w-4 h-4 mr-2" />
        Đăng ký khóa học này
      </Button>
    );
  }

  return (
    <Button onClick={handleAccess} className="w-full">
      <LockIcon className="w-4 h-4 mr-2" />
      Thanh toán để học
    </Button>
  );
}
