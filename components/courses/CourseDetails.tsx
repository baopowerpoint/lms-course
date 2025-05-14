"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/lib/actions/course.action";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, ChevronUp, Clock, Play, User, Tag, BookOpenCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AccessButton from "@/components/courses/AccessButton";
import { useAuth } from "@clerk/nextjs";
import { checkUserPayment, checkCourseAccess } from "@/lib/actions/payment.actions";

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

const CourseDetails = ({ course }: CourseDetailsProps) => {
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [isCheckingEnrollment, setIsCheckingEnrollment] =
    useState<boolean>(true);
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
      <div className={`py-6 sm:py-10 md:py-16 lg:py-20 bg-gradient-to-b ${heroColor}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Left column - Course info */}
            <div className="lg:col-span-7 order-2 lg:order-1 mt-6 lg:mt-0">
              {/* Breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <Link
                  href="/courses"
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Khóa học
                </Link>
                <span className="text-xs sm:text-sm text-gray-500">/</span>
                {course.category && (
                  <Link
                    href={`/courses?category=${encodeURIComponent(course.category.name)}`}
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {course.category.name}
                  </Link>
                )}
              </div>

              {/* Course Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 text-gray-900">
                {course.title}
              </h1>

              {/* Course Description */}
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">{course.description}</p>
              
              {/* Course Author */}
              {course.author && (
                <div className="flex items-center mb-4 sm:mb-6">
                  {course.author.image && (
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0 border border-gray-200">
                      <Image
                        src={course.author.image}
                        alt={course.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Giảng viên</p>
                    <p className="text-sm font-medium text-gray-900">{course.author.name}</p>
                  </div>
                </div>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
                <div className="flex items-center px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {totalLessons} bài học
                  </span>
                </div>
                {course.modules && course.modules.length > 0 && (
                  <div className="flex items-center px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {course.modules.length} chương
                    </span>
                  </div>
                )}
                {course.category && (
                  <div className="flex items-center px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {course.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Right column - Course image and pricing */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
                {/* Course Image */}
                {course.image ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Thanh toán / Truy cập */}
                <div className="p-4 sm:p-6">
                  <div className="text-lg sm:text-xl font-bold mb-3">
                    {formatPrice(course.price)}
                  </div>
                  {isCheckingEnrollment ? (
                    <Button disabled className="w-full text-sm sm:text-base">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tải...
                    </Button>
                  ) : isSignedIn ? (
                    <AccessButton
                      courseId={course._id}
                      courseSlug={course.slug}
                    />
                  ) : (
                    <Link href="/sign-in" passHref className="block w-full">
                      <Button variant="outline" className="w-full text-sm sm:text-base">
                        Đăng nhập để tiếp tục
                      </Button>
                    </Link>
                  )}

                  {/* Nút xem thử */}
                  <div className="mt-4">
                    <Button
                      className="w-full justify-center"
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
        </div>
      </div>

      {/* Course Content Section */}
      <div className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Nội dung khóa học</h2>

              {!hasModules && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
                  <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                    Nội dung đang được cập nhật
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Nội dung của khóa học này đang được biên soạn và sẽ sớm được
                    cập nhật.
                  </p>
                </div>
              )}

              {hasModules && course.modules && (
                <div className="space-y-4">
                  {course.modules.map((module: any, moduleIndex: number) => (
                    <div key={module._id || moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <button
                        className="w-full flex items-center justify-between p-3 sm:p-4 md:p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleModule(module._id)}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-primary/10 text-primary font-medium h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center flex-shrink-0">
                            {moduleIndex + 1}
                          </div>
                          <h3 className="font-semibold text-base sm:text-lg">{module.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {module.lessons && (
                            <span className="text-xs sm:text-sm text-gray-500">
                              {module.lessons.length} bài học
                            </span>
                          )}
                          {expandedModules[module._id] ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          )}
                        </div>
                      </button>

                      {expandedModules[module._id] && module.lessons && module.lessons.length > 0 && (
                        <div className="divide-y divide-gray-100">
                          {module.lessons.map((lesson: any, lessonIndex: number) => (
                            <div key={lesson._id || lessonIndex} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <span className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">{moduleIndex + 1}.{lessonIndex + 1}</span>
                                <div className="flex-1">
                                  <h4 className="text-sm sm:text-base font-medium">{lesson.title}</h4>
                                  {lesson.description && (
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{lesson.description}</p>
                                  )}
                                  {lesson.duration && (
                                    <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-500">
                                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
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

            <div className="md:col-span-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Thông tin thêm</h2>

              {course.author && course.author.bio && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                  <h3 className="font-semibold mb-2 sm:mb-4">Về giảng viên</h3>
                  <div className="flex items-start mb-2 sm:mb-4">
                    {course.author.image && (
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
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
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {course.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {course.tags && course.tags.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center mb-2 sm:mb-4">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                    <h3 className="font-semibold">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag: string, index: number) => (
                      <Link
                        key={index}
                        href={`/courses?q=${encodeURIComponent(tag)}`}
                        className="bg-white text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
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

export default CourseDetails;
