"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PromotionSectionProps {
  endDate: Date;
}

export const PromotionSection = ({ endDate }: PromotionSectionProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const router = useRouter();

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

  // Update time left
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === "Đã kết thúc") {
        clearInterval(interval);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endDate]);

  const handleViewCourses = () => {
    router.push("/courses");
  };

  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
      <div className="container p-4 mx-auto px-4 flex items-center flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image side */}
            <div className="lg:w-1/2 relative  lg:h-auto">
              <div className=" inset-0 z-10 flex items-center justify-center text-primary p-8">
                <div>
                  <h2 className="text-xl mt-2 font-bold mb-2">
                    Ưu Đãi Đặc Biệt
                  </h2>
                  <div className="text-primary/90 mb-6">
                    Truy cập toàn bộ khóa học Havamath với mức giá ưu đãi không
                    thể tốt hơn
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 inline-block mb-6">
                    <div className="text-sm font-medium mb-1">
                      Thời gian còn lại:
                    </div>
                    <div className="flex items-center gap-2 text-xl font-bold">
                      <Clock className="h-5 w-5" />
                      <span>{timeLeft}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-primary/80 line-through text-lg">
                      {formatPrice(1199000)}
                    </span>
                    <span className="text-primary font-bold text-3xl">
                      {formatPrice(899000)}
                    </span>
                    <span className="bg-amber-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                      -25%
                    </span>
                  </div>
                  <Image
                    src="/images/promotion.png"
                    alt="Ưu đãi khóa học"
                    width={500}
                    height={500}
                    className=" size-48 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content side */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6">
                Trọn bộ khóa học toán với mức giá không thể tốt hơn
              </h3>

              <div className="grid grid-cols-1  gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Truy cập toàn bộ</h4>
                    <p className="text-gray-600 text-sm">
                      Tất cả các khóa học toán từ cơ bản đến nâng cao
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Hỗ trợ trọn đời</h4>
                    <p className="text-gray-600 text-sm">
                      Hỗ trợ và cập nhật miễn phí không giới hạn
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Tài liệu độc quyền</h4>
                    <p className="text-gray-600 text-sm">
                      Bộ sưu tập đầy đủ tài liệu học tập chất lượng cao
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Giáo viên hỗ trợ</h4>
                    <p className="text-gray-600 text-sm">
                      Hỗ trợ từ đội ngũ giáo viên có kinh nghiệm
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleViewCourses}
                size="lg"
                className="w-full lg:w-auto"
              >
                Khám phá khóa học ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-4 text-center text-xs text-gray-500">
                *Ưu đãi có thể kết thúc sớm, số lượng có hạn
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
