"use client";

import { Course, categoryNames } from "@/lib/data/courses";
import { Button } from "@/components/ui/button";
import { Clock, Users, BarChart } from "lucide-react";

interface CourseInformationProps {
  course: Course;
}

export const CourseInformation = ({ course }: CourseInformationProps) => {
  const {
    description,
    instructor,
    category,
    grade,
    level,
    lessonsCount,
    durationInMinutes,
    topics,
    reviewCount,
    rating,
  } = course;

  const durationInHours = Math.ceil(durationInMinutes / 60);

  // Map level to Vietnamese
  const levelText = {
    beginner: "Cơ bản",
    intermediate: "Trung cấp",
    advanced: "Nâng cao",
  }[level];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Giới thiệu khoá học</h2>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Bạn sẽ học được gì</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((topic, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-2 mt-1 text-primary">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-700">{topic}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Thông tin khoá học</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium">Thời lượng</span>
            </div>
            <p className="text-gray-700">
              {durationInHours} giờ học ({lessonsCount} bài học)
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium">Cấp độ</span>
            </div>
            <p className="text-gray-700">{levelText}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium">Lớp</span>
            </div>
            <p className="text-gray-700">Lớp {grade}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Giảng viên</h2>
        <div className="flex items-start">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium mr-4 flex-shrink-0">
            {instructor.avatar}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{instructor.name}</h3>
            <p className="text-gray-600 mb-2">
              Giảng viên {categoryNames[category]}
            </p>
            <p className="text-gray-700">
              Giảng viên giàu kinh nghiệm với nhiều năm giảng dạy tại các trường
              chuyên. Có phương pháp giảng dạy đơn giản, dễ hiểu và hiệu quả
              giúp học sinh tiếp thu kiến thức một cách nhanh chóng.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Đánh giá từ học viên</h2>
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.floor(rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-lg font-medium">{rating}</span>
          <span className="text-gray-600 ml-2">({reviewCount} đánh giá)</span>
        </div>

        <div className="space-y-4">
          {/* Sample reviews */}
          <div className="border-b pb-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-2">
                HV
              </div>
              <div>
                <p className="font-medium">Học viên ẩn danh</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700">
              Khoá học rất hay và dễ hiểu. Giảng viên giảng dạy rõ ràng, chi
              tiết. Tôi đã học được rất nhiều điều từ khoá học này.
            </p>
          </div>

          <div className="border-b pb-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-2">
                KH
              </div>
              <div>
                <p className="font-medium">Khách hàng ẩn danh</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        index < 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700">
              Nội dung khóa học rất đầy đủ, tuy nhiên tôi mong muốn có thêm
              nhiều bài tập hơn để thực hành.
            </p>
          </div>
        </div>

        <Button variant="outline" className="mt-4">
          Xem tất cả đánh giá
        </Button>
      </div>
    </div>
  );
};
