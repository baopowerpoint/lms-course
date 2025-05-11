import { getCourseBySlug } from "@/lib/actions/course.action";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseLearnLayoutProps {
  children: React.ReactNode;
  params: {
    courseSlug: string;
  };
}

export async function generateMetadata({ params }: CourseLearnLayoutProps): Promise<Metadata> {
  // Make sure to use the resolved params
  const courseSlug = params.courseSlug;
  const course = await getCourseBySlug(courseSlug);
  
  if (!course) {
    return {
      title: "Không tìm thấy khóa học",
      description: "Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
    };
  }
  
  return {
    title: `${course.title} | Học tập`,
    description: `Học khóa học ${course.title}`
  };
}

export default async function CourseLearnLayout({ children, params }: CourseLearnLayoutProps) {
  // Make sure to use the resolved params
  const courseSlug = params.courseSlug;
  const course = await getCourseBySlug(courseSlug);
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy khóa học</h1>
          <p className="mt-2 text-gray-600">
            Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/courses">
              Quay lại danh sách khóa học
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Course header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-2" asChild>
                <Link href="/dashboard/courses">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Quay lại
                </Link>
              </Button>
              <h1 className="text-lg font-medium truncate">{course.title}</h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
