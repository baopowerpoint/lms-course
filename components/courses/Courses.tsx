"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourses, Course } from "@/lib/actions/course.action";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { checkCourseAccess } from "@/lib/actions/enrollment.action";
import { useAuth } from "@clerk/nextjs";

const CourseCard = ({ course }: { course: Course }) => {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState<boolean>(true);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  
  // Check if user is enrolled in this course
  useEffect(() => {
    const checkEnrollment = async () => {
      if (isSignedIn) {
        try {
          setIsCheckingEnrollment(true);
          const hasAccess = await checkCourseAccess(course._id);
          setIsEnrolled(hasAccess);
        } catch (error) {
          console.error("Error checking course access:", error);
        } finally {
          setIsCheckingEnrollment(false);
        }
      } else {
        setIsEnrolled(false);
        setIsCheckingEnrollment(false);
      }
    };
    
    checkEnrollment();
  }, [course._id, isSignedIn]);
  
  // Generate a pastel background color based on the course title
  const generateColor = (str: string) => {
    const colors = [
      "bg-emerald-100",
      "bg-blue-100",
      "bg-purple-100",
      "bg-orange-100",
      "bg-pink-100",
      "bg-teal-100",
      "bg-yellow-100",
      "bg-indigo-100",
    ];
    
    // Simple hash function to determine color index
    const hash = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Generate an emoji based on the course title or category
  const generateEmoji = (str: string) => {
    const emojis = ["📚", "🧮", "📐", "🔢", "📊", "🔍", "📝", "🧩"];
    const hash = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
  };

  const bgColor = generateColor(course.title);
  const emoji = generateEmoji(course.title);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-300 hover:-translate-y-1">
      {/* Course image/header - clickable to course details */}
      <Link href={`/courses/${course.slug}`}>
        <div className={`relative h-40 ${bgColor} flex items-center justify-center overflow-hidden`}>
          {course.image ? (
            <Image 
              src={course.image} 
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-4xl">{emoji}</span>
          )}
        </div>
      </Link>
      
      <div className="p-6 flex-grow flex flex-col">
        {/* Course title and category - clickable to course details */}
        <Link href={`/courses/${course.slug}`} className="group">
          <div className="flex justify-between items-start gap-2 mb-3">
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
            {course.category && (
              <span className="text-xs font-medium py-1 px-2 bg-gray-100 rounded-full whitespace-nowrap">
                {course.category.name}
              </span>
            )}
          </div>
        </Link>
        
        {course.description && (
          <Link href={`/courses/${course.slug}`}>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 hover:text-gray-800 transition-colors">{course.description}</p>
          </Link>
        )}
        
        <div className="mt-auto">
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {course.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs py-1 px-2 bg-gray-50 text-gray-600 rounded-full">
                  {tag}
                </span>
              ))}
              {course.tags.length > 3 && (
                <span className="text-xs py-1 px-2 bg-gray-50 text-gray-600 rounded-full">
                  +{course.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <Link href={`/courses/${course.slug}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {course.author && course.author.image && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image 
                      src={course.author.image} 
                      alt={course.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {course.author && (
                  <span className="text-xs text-gray-600">{course.author.name}</span>
                )}
              </div>
              <span className="font-semibold text-primary">
                {course.price ? formatPrice(course.price) : "Miễn phí"}
              </span>
            </div>
          </Link>
          
          {/* Add to Cart button OR Go to Course button */}
          <div onClick={(e) => e.stopPropagation()}>
            {isCheckingEnrollment ? (
              <Button variant="outline" size="sm" className="w-full" disabled>
                Đang kiểm tra...
              </Button>
            ) : isEnrolled ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                onClick={() => router.push(`/courses/${course._id}/learn`)}
              >
                <BookOpenCheck className="w-4 h-4 mr-2" />
                Vào học ngay
              </Button>
            ) : (
              <AddToCartButton 
                course={course}
                variant="outline"
                size="sm"
                fullWidth={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses({
          query,
          category,
          page: 1,
          limit: 8
        });
        
        setCourses(data);
        setHasMore(data.length === 8);
        setPage(1);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [query, category]);
  
  const handleLoadMore = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getCourses({
        query,
        category,
        page: nextPage,
        limit: 8
      });
      
      if (data.length > 0) {
        setCourses(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === 8);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more courses:", error);
    } finally {
      setLoadingMore(false);
    }
  };
  
  if (loading) {
    return (
      <div className="mt-10 flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (courses.length === 0) {
    return (
      <div className="mt-10 py-20 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học nào</h3>
        <p className="text-gray-600 mb-6">Vui lòng thử với từ khóa khác hoặc xem tất cả khóa học của chúng tôi</p>
        <Button 
          variant="outline"
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("q");
            url.searchParams.delete("category");
            window.location.href = url.toString();
          }}
        >
          Xem tất cả khóa học
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              "Xem thêm khóa học"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Courses;
