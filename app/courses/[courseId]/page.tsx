"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CourseInformation } from "@/components/courses/CourseInformation";
import { CourseContent } from "@/components/courses/CourseContent";
import { RelatedCourses } from "@/components/courses/RelatedCourses";
import { courses, categoryNames } from "@/lib/data/courses";
import { generateLessonsForCourse, type Chapter } from "@/lib/data/lessons";
import { formatPrice } from "@/lib/utils";
import { Check, Clock, BookOpen, Users } from "lucide-react";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<string>("information");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  // Find the course by ID
  const course = courses.find((c) => c.id === courseId);
  
  // If course not found, show 404
  if (!course) {
    notFound();
  }
  
  // Find related courses from the same category
  const relatedCourses = courses.filter(
    (c) => c.category === course.category && c.id !== course.id
  ).slice(0, 3);
  
  useEffect(() => {
    // Generate lessons for this course
    const courseChapters = generateLessonsForCourse(course.id);
    setChapters(courseChapters);
  }, [course.id]);
  
  // Calculate total lessons and duration from chapters
  const totalLessons = chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0
  );
  
  const totalDuration = chapters.reduce(
    (total, chapter) =>
      total +
      chapter.lessons.reduce(
        (chapterTotal, lesson) => chapterTotal + lesson.durationInMinutes,
        0
      ),
    0
  );
  
  const durationInHours = Math.ceil(course.durationInMinutes / 60);
  
  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Khóa học", href: "/courses" },
              { label: course.title },
            ]}
          />
        </div>
      </div>
      
      {/* Course header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 pt-10 pb-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  {categoryNames[course.category]}
                </span>
                <span className="text-sm font-medium px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  Lớp {course.grade}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-gray-700 mb-4">{course.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <div className="flex mr-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star}
                        className={`w-5 h-5 ${star <= Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-medium">{course.rating}</span>
                  <span className="text-gray-600 ml-1">({course.reviewCount} đánh giá)</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-1" />
                  <span className="text-gray-600">{course.reviewCount} học viên</span>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium mr-3">
                  {course.instructor.avatar}
                </div>
                <div>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-sm text-gray-600">Giảng viên</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>Cập nhật {new Date(course.updatedAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span>{course.lessonsCount} bài học</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>Thời lượng {durationInHours} giờ</span>
                </div>
              </div>
            </div>
            
            {/* Course card */}
            <div className="lg:sticky lg:top-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
                {/* Course thumbnail */}
                <div className={`h-56 relative ${course.thumbnail} flex items-center justify-center`}>
                  <span className="text-6xl">
                    {course.category === "algebra" && "🧮"}
                    {course.category === "geometry" && "📐"}
                    {course.category === "calculus" && "📊"}
                    {course.category === "arithmetic" && "🔢"}
                    {course.category === "statistics" && "📈"}
                    {course.category === "probability" && "🎲"}
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    {course.salePrice ? (
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-primary mr-2">
                          {formatPrice(course.salePrice)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(course.price)}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <Button className="w-full text-base py-6 h-auto">
                      Đăng ký học ngay
                    </Button>
                    <Button variant="outline" className="w-full text-base py-6 h-auto">
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="font-medium">Khóa học này bao gồm:</p>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Truy cập trọn đời</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>{course.lessonsCount} bài học</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Bài tập thực hành</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Chứng chỉ hoàn thành</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Hỗ trợ trực tuyến</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs
              defaultValue="information"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full mb-6">
                <TabsTrigger value="information" className="flex-1">
                  Thông tin khoá học
                </TabsTrigger>
                <TabsTrigger value="content" className="flex-1">
                  Nội dung khoá học
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="information">
                <CourseInformation course={course} />
              </TabsContent>
              
              <TabsContent value="content">
                <CourseContent
                  chapters={chapters}
                  totalLessons={totalLessons}
                  totalDuration={totalDuration}
                />
              </TabsContent>
            </Tabs>
            
            {/* Related courses */}
            <RelatedCourses
              currentCourseId={course.id}
              relatedCourses={relatedCourses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
