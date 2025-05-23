"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/lib/actions/course.action";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  User,
  Tag,
  BookOpenCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AccessButton from "@/components/courses/AccessButton";
import { useAuth } from "@clerk/nextjs";

interface CourseDetailsProps {
  course: Course;
}

interface Module {
  _id: string;
  title: string;
  lessons?: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
}

interface Author {
  name: string;
  image?: string;
  bio?: string;
}

interface Category {
  name: string;
}

const CourseDetailsNew = ({ course }: CourseDetailsProps) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState<boolean>(true);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Đơn giản hóa việc kiểm tra quyền truy cập - đã được chuyển sang AccessButton
  useEffect(() => {
    setIsCheckingEnrollment(false);
  }, []);

  const handleEnrollCourse = () => {
    // Xem thử bài học hoặc học miễn phí
    if (
      course.modules &&
      course.modules.length > 0 &&
      course.modules[0].lessons &&
      course.modules[0].lessons.length > 0
    ) {
      router.push(
        `/courses/${course.slug}/lessons/${course.modules[0].lessons[0]._id}`
      );
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Tạo màu nền gradient cho hero section
  const generateHeroColor = (title: string) => {
    const colors = [
      "from-emerald-50 to-emerald-100/50",
      "from-blue-50 to-blue-100/50",
      "from-purple-50 to-purple-100/50",
      "from-orange-50 to-orange-100/50",
      "from-pink-50 to-pink-100/50",
      "from-teal-50 to-teal-100/50",
    ];

    const hash = title
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const heroColor = generateHeroColor(course.title);

  // Tính tổng số bài học
  const totalLessons =
    course.modules?.reduce(
      (acc: number, module: any) => acc + (module.lessons?.length || 0),
      0
    ) || 0;

  // Kiểm tra có module nào không
  const hasModules = course.modules && course.modules.length > 0;

  return (
    <React.Fragment>
      {/* Hero Section */}
      <div className={`py-16 md:py-24 bg-gradient-to-b ${heroColor}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <Link
                  href="/courses"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Khóa học
                </Link>
                <span className="text-sm text-gray-500">/</span>
                {course.category && (
                  <Link
                    href={`/courses?category=${encodeURIComponent(course.category.name)}`}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {course.category.name}
                  </Link>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                {course.title}
              </h1>

              <p className="text-lg mb-8">{course.description}</p>

              {course.author && (
                <div className="flex items-center mb-6">
                  {course.author.image && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={course.author.image}
                        alt={course.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Giảng viên</p>
                    <p className="font-medium">{course.author.name}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center px-3 py-1.5 bg-primary/10 rounded-full">
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">
                    {totalLessons} bài học
                  </span>
                </div>
                {course.modules && course.modules.length > 0 && (
                  <div className="flex items-center px-3 py-1.5 bg-primary/10 rounded-full">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      {course.modules.length} chương
                    </span>
                  </div>
                )}
                {course.category && (
                  <div className="flex items-center px-3 py-1.5 bg-primary/10 rounded-full">
                    <Tag className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      {course.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Thanh toán / Truy cập */}
              <div className="mb-4">
                <div className="text-2xl font-bold mb-2">
                  {formatPrice(course.price)}
                </div>
                {isCheckingEnrollment ? (
                  <Button disabled className="w-full">
                    Đang tải...
                  </Button>
                ) : isSignedIn ? (
                  <AccessButton courseId={course._id} courseSlug={course.slug} />
                ) : (
                  <Link href="/sign-in" passHref>
                    <Button variant="outline" className="w-full">
                      Đăng nhập để tiếp tục
                    </Button>
                  </Link>
                )}
              </div>

              {/* Nút xem thử */}
              <div className="mt-4">
                <Button 
                  size="lg" 
                  className="px-8" 
                  onClick={handleEnrollCourse}
                  variant="outline"
                >
                  {course.price > 0 ? "Xem thử bài học" : "Học miễn phí"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>

              {!hasModules && (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Nội dung đang được cập nhật
                  </h3>
                  <p className="text-gray-600">
                    Nội dung của khóa học này đang được biên soạn và sẽ sớm được
                    cập nhật.
                  </p>
                </div>
              )}

              {hasModules && course.modules && (
                <div className="space-y-4">
                  {course.modules.map((module: any, moduleIndex: number) => (
                    <div
                      key={module._id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between bg-gray-50 p-4 text-left"
                        onClick={() => toggleModule(module._id)}
                      >
                        <div className="flex items-center">
                          <span className="font-semibold text-primary mr-2">
                            {moduleIndex + 1}.
                          </span>
                          <h3 className="font-semibold">{module.title}</h3>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-3">
                            {module.lessons?.length || 0} bài học
                          </span>
                          {expandedModules[module._id] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>

                      {expandedModules[module._id] &&
                        module.lessons &&
                        module.lessons.length > 0 && (
                          <div className="divide-y divide-gray-100">
                            {module.lessons.map((lesson: any, lessonIndex: number) => (
                              <div
                                key={lesson._id}
                                className="p-4 hover:bg-gray-50"
                              >
                                <div className="flex items-start">
                                  <span className="font-medium text-gray-500 mr-3">
                                    {moduleIndex + 1}.{lessonIndex + 1}
                                  </span>
                                  <div>
                                    <h4 className="font-medium">
                                      {lesson.title}
                                    </h4>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {lesson.description}
                                      </p>
                                    )}
                                    {lesson.duration && (
                                      <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{lesson.duration} phút</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Thông tin thêm</h2>

              {course.author && course.author.bio && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-4">Về giảng viên</h3>
                  <div className="flex items-start mb-4">
                    {course.author.image && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={course.author.image}
                          alt={course.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{course.author.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {course.tags && course.tags.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Tag className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-semibold">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag: string, index: number) => (
                      <Link
                        key={index}
                        href={`/courses?q=${encodeURIComponent(tag)}`}
                        className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CourseDetailsNew;
