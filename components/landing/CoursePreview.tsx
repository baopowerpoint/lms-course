"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Course, getCourses } from "@/lib/actions/course.action";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Duolingo from "../ui/duolingo-button";

interface CourseCardProps {
  course: Course;
  colorIndex: number;
}

// Array of background colors to use for courses
const COURSE_COLORS = [
  "bg-emerald-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-orange-100",
  "bg-pink-100",
  "bg-indigo-100",
];

const CourseCard = ({ course, colorIndex }: CourseCardProps) => {
  const { title, category, slug } = course;
  const color = COURSE_COLORS[colorIndex % COURSE_COLORS.length];
  // For now, we'll use a placeholder progress value
  const progress = 0;
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/30 group transform hover:-translate-y-2">
      <div
        className={`h-24 ${color} flex items-center justify-center relative overflow-hidden`}
      >
        {course.image ? (
          <Image
            src={course.image}
            alt={title}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl group-hover:scale-125 transition-transform duration-300">
            📚
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description || "Khám phá khóa học này ngay bây giờ"}
        </p>
        {category && (
          <span className="text-xs font-medium py-1 mb-5 px-2 bg-gray-100 rounded-full">
            {category.name}
          </span>
        )}
        <div className="mb-4 mt-5">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-primary rounded-full",
                progress === 0
                  ? "w-0"
                  : progress <= 25
                    ? "w-1/4"
                    : progress <= 50
                      ? "w-1/2"
                      : progress <= 75
                        ? "w-3/4"
                        : "w-full"
              )}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {progress}% hoàn thành
            </span>
            {progress > 0 && (
              <span className="text-xs font-medium text-primary">Tiếp tục</span>
            )}
          </div>
        </div>

        <Link href={`/courses/${slug}`} className="block w-full">
          <Duolingo className="w-full rounded-lg">
            {progress > 0 ? "Tiếp tục học" : "Xem chi tiết"}
          </Duolingo>
        </Link>
      </div>
    </div>
  );
};

export const CoursePreview = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const data = await getCourses({
          limit: 4, // Get the first 4 courses for the preview section
        });
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Khoá học nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các khoá học đa dạng từ cơ bản đến nâng cao, được thiết kế
            với phương pháp học tập hiệu quả
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="mt-4 text-gray-500 animate-pulse">Đang tải khóa học...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <div 
                key={course._id} 
                className={`opacity-0 animate-fadeIn animation-delay-${index} animate-fill-forwards`}
              >
                <CourseCard course={course} colorIndex={index} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/courses">
            <Button 
              variant="outline" 
              className="rounded-full px-6 transform transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Xem tất cả khoá học
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
