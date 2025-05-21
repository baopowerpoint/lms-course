"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import Duolingo from "../ui/duolingo-button";

interface PromotionPopupProps {
  endDate: Date; // Ngày kết thúc khuyến mãi
}

export const PromotionPopup = ({ endDate }: PromotionPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Format time left as days, hours, minutes
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      return "Đã kết thúc";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} ngày ${hours} giờ ${minutes} phút`;
  };

  // Check if user has already purchased courses
  const checkUserPurchase = async () => {
    if (!isSignedIn || !user) return;

    try {
      const response = await fetch(`/api/user/has-purchased`);
      const data = await response.json();

      // Only show popup if user hasn't purchased any course
      if (!data.hasPurchased) {
        // Check sessionStorage to see if popup was closed in this session
        // Using sessionStorage instead of localStorage makes it trigger again on reload
        const popupClosed = sessionStorage.getItem("promotion_closed");
        if (!popupClosed) {
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  // Update time left
  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === "Đã kết thúc") {
        clearInterval(interval);
        setIsOpen(false);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isOpen, endDate]);

  // Check user purchase status on mount
  useEffect(() => {
    // Small delay to prevent popup appearing immediately on load
    const timer = setTimeout(() => {
      checkUserPurchase();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isSignedIn, user]);

  const handleClose = () => {
    setIsOpen(false);
    // Use sessionStorage instead of localStorage to make popup appear again on reload
    sessionStorage.setItem("promotion_closed", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative animate-fade-in-up shadow-xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Đóng cửa sổ khuyến mãi"
          title="Đóng"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            🎉 Ưu Đãi Đặc Biệt Dành Cho Bạn! 🎉
          </h2>
          <div className="text-amber-600 font-semibold flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Thời gian còn lại: {timeLeft}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2 relative aspect-video overflow-hidden rounded-lg">
            <Image
              src="/images/promotion.png"
              alt="Ưu đãi đặc biệt"
              fill
              className="object-cover"
            />
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-semibold mb-3">
              Gói Học Tập Toàn Diện
            </h3>
            <p className="text-gray-600 mb-4">
              Truy cập tất cả các khóa học toán học với giá ưu đãi chỉ trong
              thời gian giới hạn!
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <div className="text-green-500 font-bold text-lg">✓</div>
                <p>Truy cập trọn đời tất cả khóa học</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-500 font-bold text-lg">✓</div>
                <p>Hỗ trợ 1-1 từ giáo viên</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-500 font-bold text-lg">✓</div>
                <p>Tài liệu học tập độc quyền</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-500 font-bold text-lg">✓</div>
                <p>Cập nhật miễn phí suốt đời</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-gray-400 line-through text-lg">
                {formatPrice(1199000)}
              </span>
              <span className="text-primary font-bold text-2xl">
                {formatPrice(899000)}
              </span>
              <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full font-medium">
                Giảm 25%
              </span>
            </div>

            <div className="space-x-3">
              <Duolingo
                onClick={() => {
                  handleClose();
                  router.push("/courses");
                }}
              >
                Xem tất cả khóa học
              </Duolingo>
              <Button variant="outline" size="lg" onClick={handleClose}>
                Để sau
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-center text-gray-500">
          *Ưu đãi chỉ áp dụng cho người dùng mới. Giá có thể thay đổi sau thời
          gian khuyến mãi.
        </div>
      </div>
    </div>
  );
};

export default PromotionPopup;
