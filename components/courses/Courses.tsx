"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourses, Course } from "@/lib/actions/course.action";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { checkCourseAccess } from "@/lib/actions/payment.actions";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Duolingo from "../ui/duolingo-button";

// Utility functions for styling (moved outside component to avoid recreation on each render)
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
  const hash = str
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const generateEmoji = (str: string) => {
  const emojis = ["📚", "🧮", "📐", "🔢", "📊", "🔍", "📝", "🧩"];
  const hash = str
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return emojis[hash % emojis.length];
};

// EnrollCourseButton component for direct enrollment without shopping cart
const EnrollCourseButton = ({
  course,
  hasAccess,
  isCheckingAccess,
}: {
  course: Course;
  hasAccess: boolean;
  isCheckingAccess: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleEnroll = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (!hasAccess) {
      // If user hasn't paid, redirect to subscription page
      router.push("/subscription");
      return;
    }

    try {
      setIsLoading(true);
      // User already has access, just navigate to the course
      toast.success("Bạn có quyền truy cập vào khóa học này!");
      router.push(`/courses/${course.slug}/learn`);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi truy cập khóa học.");
      console.error("Error accessing course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAccess) {
    return (
      <Button variant="outline" size="sm" className="w-full" disabled>
        Đang kiểm tra...
      </Button>
    );
  }
  
  // Consolidated button logic to reduce duplication
  const buttonText = hasAccess ? "Đăng ký khóa học" : "Đăng ký ngay";
  const buttonClass = hasAccess 
    ? "w-full bg-blue-600 hover:bg-blue-700 text-white" 
    : "w-full";
  
  return (
    <Button
      onClick={handleEnroll}
      size="sm"
      className={buttonClass}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Đang đăng ký...
        </>
      ) : (
        <>{buttonText}</>
      )}
    </Button>
  );
};

const CourseCard = ({
  course,
  hasAccess,
  isCheckingAccess,
}: {
  course: Course;
  hasAccess: boolean;
  isCheckingAccess: boolean;
}) => {
  // Use the utility functions moved outside the component
  const bgColor = generateColor(course.title);
  const emoji = generateEmoji(course.title);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-300 hover:-translate-y-1">
      {/* Course image/header - clickable to course details */}
      <Link href={`/courses/${course.slug}`}>
        <div
          className={`relative h-40 ${bgColor} flex items-center justify-center overflow-hidden`}
        >
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
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            {course.category && (
              <span className="text-xs font-medium py-1 px-2 bg-gray-100 rounded-full whitespace-nowrap">
                {course.category.name}
              </span>
            )}
          </div>
        </Link>

        {course.description && (
          <Link href={`/courses/${course.slug}`}>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 hover:text-gray-800 transition-colors">
              {course.description}
            </p>
          </Link>
        )}

        <div className="mt-auto">
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {course.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs py-1 px-2 bg-gray-50 text-gray-600 rounded-full"
                >
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
                  <span className="text-xs text-gray-600">
                    {course.author.name}
                  </span>
                )}
              </div>
              <span className="font-semibold text-primary">
                {course.price ? formatPrice(course.price) : "Miễn phí"}
              </span>
            </div>
          </Link>

          {/* Add to Cart button OR Go to Course button */}
          <div onClick={(e) => e.stopPropagation()}>
            {isCheckingAccess ? (
              <div className="flex justify-between mt-1">
                <p className="font-bold text-xl">
                  {formatPrice(course.price)}
                </p>
                <Button variant="outline" size="sm" disabled className="w-20">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              </div>
            ) : hasAccess ? (
              <Link href={`/courses/${course.slug}/learn`}>
                <Duolingo className="mt-0 bg-blue-700 hover:bg-blue-600 text-white flex items-center gap-1">
                  <BookOpenCheck className="w-3.5 h-3.5 mr-1" />
                  Vào học ngay
                </Duolingo>
              </Link>
            ) : (
              <EnrollCourseButton
                course={course}
                hasAccess={hasAccess}
                isCheckingAccess={isCheckingAccess}
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isSignedIn } = useAuth();
  const searchParams = useSearchParams();

  // Single course access check for all courses
  // Single course access check for all courses - optimized to reduce API calls
  useEffect(() => {
    const checkAccessStatus = async () => {
      if (!isSignedIn) {
        setHasAccess(false);
        setIsCheckingAccess(false);
        return;
      }
        
      try {
        setIsCheckingAccess(true);
        // Make a single API call to check access instead of one per course
        const result = await checkCourseAccess();
        setHasAccess(result.hasAccess);
      } catch (error) {
        console.error("Error checking course access status:", error);
        setHasAccess(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccessStatus();
  }, [isSignedIn]);

  // Fetch courses when search parameters change
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        // Extract query params
        const query = searchParams.get("q") || undefined;
        const category = searchParams.get("category") || undefined;

        const coursesData = await getCourses({ query, category, page: 1, limit: 8 });
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setHasMore(coursesData.length === 8);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams]);

  // Function to load more courses
  const loadMoreCourses = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      // Extract query params
      const query = searchParams.get("q") || undefined;
      const category = searchParams.get("category") || undefined;

      const moreCourses = await getCourses({ query, category, page: nextPage, limit: 8 });
      
      if (moreCourses.length > 0) {
        setCourses((prev) => [...prev, ...moreCourses]);
        setCurrentPage(nextPage);
        setHasMore(moreCourses.length === 8);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more courses:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="w-full flex justify-center py-10">
        <p className="text-muted-foreground">Không tìm thấy khóa học nào.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            hasAccess={hasAccess}
            isCheckingAccess={isCheckingAccess}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button 
            onClick={loadMoreCourses}
            disabled={loadingMore}
            className="bg-primary hover:bg-primary/90 text-white px-8"
            size="lg"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tải...
              </>
            ) : (
              "Tải thêm khóa học"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Courses;
