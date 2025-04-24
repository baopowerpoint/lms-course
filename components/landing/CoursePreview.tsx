"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  title: string;
  level: string;
  lessons: number;
  progress?: number;
  color: string;
  emoji: string;
}

const CourseCard = ({ title, level, lessons, progress = 0, color, emoji }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      <div className={`h-24 ${color} flex items-center justify-center`}>
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">{title}</h3>
          <span className="text-xs font-medium py-1 px-2 bg-gray-100 rounded-full">
            {level}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{lessons} bài học</p>
        
        <div className="mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full bg-primary rounded-full",
                progress === 0 ? "w-0" : progress <= 25 ? "w-1/4" : 
                progress <= 50 ? "w-1/2" : progress <= 75 ? "w-3/4" : "w-full"
              )}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{progress}% hoàn thành</span>
            {progress > 0 && (
              <span className="text-xs font-medium text-primary">Tiếp tục</span>
            )}
          </div>
        </div>
        
        <Button className="w-full rounded-lg">
          {progress > 0 ? "Tiếp tục học" : "Bắt đầu học"}
        </Button>
      </div>
    </div>
  );
};

export const CoursePreview = () => {
  const courses: CourseCardProps[] = [
    {
      title: "Đại số cơ bản",
      level: "Sơ cấp",
      lessons: 42,
      progress: 65,
      color: "bg-emerald-100",
      emoji: "🧮"
    },
    {
      title: "Hình học phẳng",
      level: "Sơ cấp",
      lessons: 36,
      progress: 25,
      color: "bg-blue-100",
      emoji: "📐"
    },
    {
      title: "Số học và Tỉ lệ",
      level: "Sơ cấp",
      lessons: 28,
      progress: 0,
      color: "bg-purple-100",
      emoji: "🔢"
    },
    {
      title: "Giải tích cơ bản",
      level: "Trung cấp",
      lessons: 45,
      progress: 0,
      color: "bg-orange-100",
      emoji: "📊"
    }
  ];

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Khoá học nổi bật</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các khoá học toán đa dạng từ cơ bản đến nâng cao,
            được thiết kế với phương pháp học tập hiệu quả
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-full px-6">
            Xem tất cả khoá học
          </Button>
        </div>
      </div>
    </section>
  );
};
