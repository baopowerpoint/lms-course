import { getUserEnrollments } from "@/lib/actions/enrollment.action";
import { getCourseById } from "@/lib/actions/course.action";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import EmptyState from "@/components/EmptyState";

// Helper function to format dates
const getFormattedDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
};

export default async function UserCoursesPage() {
  const enrollments = await getUserEnrollments();
  
  // If there are no enrollments, show an empty state
  if (enrollments.length === 0) {
    return (
      <div className="container max-w-6xl py-8">
        <h1 className="text-2xl font-bold mb-8">Khóa học của tôi</h1>
        <EmptyState 
          title="Bạn chưa có khóa học nào"
          description="Hãy tìm kiếm và mua các khóa học để bắt đầu học tập."
          action={{
            label: "Khám phá khóa học",
            href: "/courses"
          }}
        />
      </div>
    );
  }
  
  // Fetch course data for each enrollment
  const enrolledCourses = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await getCourseById(enrollment.courseId);
      return {
        enrollment,
        course
      };
    })
  );
  
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-2xl font-bold mb-8">Khóa học của tôi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map(({ enrollment, course }) => course && (
          <Card key={enrollment.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-video">
              {course.coverImage && (
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription>
                Đã tham gia: {getFormattedDate(enrollment.enrolledAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 inline-block mr-1" />
                Truy cập gần đây: {formatDistance(
                  new Date(enrollment.lastAccessed), 
                  new Date(), 
                  {
                    addSuffix: true,
                    locale: vi,
                  }
                )}
              </div>
              <div className="mt-2">
                {enrollment.isCompleted ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đã hoàn thành
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Đang học
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/learn/${course._id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Tiếp tục học
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
