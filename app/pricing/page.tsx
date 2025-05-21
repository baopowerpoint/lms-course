"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  const pricing = {
    premium: {
      name: "Gói trọn đời",
      description: "Truy cập vĩnh viễn vào tất cả các tính năng và khoá học",
      price: 899000,
      features: [
        "Truy cập tất cả các khoá học",
        "Bài tập sau mỗi bài học",
        "Diễn đàn hỗ trợ từ giáo viên",
        "Tư vấn học tập",
        "Chứng chỉ hoàn thành",
        "Tài liệu bổ sung",
        "Cập nhật nội dung liên tục",
        "Truy cập trọn đời"
      ]
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateDiscount = (monthly: number, annual: number) => {
    const monthlyTotal = monthly * 12;
    const discount = ((monthlyTotal - annual) / monthlyTotal) * 100;
    return Math.round(discount);
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Giá trị tối ưu cho việc học tập</h1>
          <p className="text-xl text-gray-600 mb-8">
            Chúng tôi cung cấp một gói dịch vụ toàn diện với đầy đủ tính năng giúp bạn tiến bộ và đạt được mục tiêu học tập.
          </p>

          <div className="mb-10 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">Đến hết ngày {new Date().getDate() + 3}/{new Date().getMonth() + 1}</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Single Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary"
          >
            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium w-full">
              Gói độc quyền
            </div>
            <div className="p-8 pt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pricing.premium.name}</h3>
              <p className="text-gray-500 mb-6">{pricing.premium.description}</p>
              <div className="mb-6">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-6xl font-bold">
                    {formatCurrency(pricing.premium.price)}
                  </span>
                </div>
                <div className="text-center text-green-600 font-medium">
                  Thanh toán một lần, sử dụng trọn đời
                </div>
              </div>
              <Link href="/courses">
                <Button className="w-full bg-primary hover:bg-primary/90 mb-6 py-6 text-lg">Đăng ký ngay</Button>
              </Link>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3">
                  {pricing.premium.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {pricing.premium.features.slice(4).map((feature, index) => (
                    <li key={index + 4} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Có câu hỏi về gói học?</h2>
          <p className="text-gray-600 mb-8">
            Liên hệ với đội ngũ hỗ trợ của chúng tôi hoặc xem các câu hỏi thường gặp để hiểu rõ hơn về các gói dịch vụ.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/faq">
              <Button variant="outline" size="lg">
                Xem câu hỏi thường gặp
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg">
                Khám phá khoá học
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
