"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { checkCourseAccess } from "@/lib/actions/payment.actions";
import { useRouter } from "next/navigation";
import { LogIn, LockIcon, Loader2 } from "lucide-react";

interface AccessButtonProps {
  courseId: string;
  courseSlug: string;
}

export default function AccessButton({ courseId, courseSlug }: AccessButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  // Kiểm tra đơn giản - chỉ xem user đã có payment thành công chưa
  useEffect(() => {
    const checkPayment = async () => {
      try {
        const result = await checkCourseAccess();
        setHasAccess(result.hasAccess);
      } catch (error) {
        console.error("Error checking payment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPayment();
  }, []);

  // Chuyển hướng đơn giản đến trang học hoặc trang thanh toán
  const handleAccess = () => {
    if (hasAccess) {
      // Nếu đã có payment thành công, chuyển đến trang học
      router.push(`/courses/${courseSlug}/learn`);
    } else {
      // Chưa có payment, chuyển đến trang thanh toán
      router.push("/subscription");
    }
  };

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Đang kiểm tra...
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

  return (
    <Button onClick={handleAccess} className="w-full">
      <LockIcon className="w-4 h-4 mr-2" />
      Thanh toán để học
    </Button>
  );
}
