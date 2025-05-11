"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { checkCourseAccess } from "@/lib/actions/enrollment.action";
import { Loader2 } from "lucide-react";

interface CourseAccessCheckProps {
  courseId: string;
  children: React.ReactNode;
}

/**
 * Middleware component to check if the user has access to a course
 * Redirects to course details page if not enrolled
 */
const CourseAccessCheck = ({ courseId, children }: CourseAccessCheckProps) => {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoaded) return;
      
      // If not signed in, redirect to course page
      if (!isSignedIn) {
        router.push(`/courses/${courseId}`);
        return;
      }
      
      // Check if user has access to this course
      const access = await checkCourseAccess(courseId);
      
      if (!access) {
        // Redirect to course details page
        router.push(`/courses/${courseId}`);
        return;
      }
      
      setHasAccess(true);
      setIsChecking(false);
    };
    
    checkAccess();
  }, [courseId, isLoaded, isSignedIn, router]);
  
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-500">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }
  
  return hasAccess ? <>{children}</> : null;
};

export default CourseAccessCheck;
