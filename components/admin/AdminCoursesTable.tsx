"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ExternalLink, BookOpen, Eye, Edit } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/progress-bar";
import Image from "next/image";
import { toast } from "sonner";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: {
    name: string;
  };
  author: {
    name: string;
    picture?: string;
  };
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminCoursesTableProps {
  courses: Course[];
  enrollmentMap: Map<string, number>;
}

export default function AdminCoursesTable({ courses, enrollmentMap }: AdminCoursesTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Build the Sanity Studio URL for a specific course
  const getSanityStudioUrl = (courseId: string) => {
    // Format for Sanity Studio URL - adjust if your studio configuration is different
    return `/studio/desk/document/course;${courseId}`;
  };

  // Get enrollment count for a course from the enrollment map
  const getEnrollmentCount = (courseId: string) => {
    return enrollmentMap.get(courseId) || 0;
  };
  
  // Calculate revenue for a course
  const getCourseRevenue = (courseId: string, price: number) => {
    const enrollments = getEnrollmentCount(courseId);
    return enrollments * price;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Khóa học</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Học viên</TableHead>
            <TableHead>Doanh thu</TableHead>
            <TableHead>Tỷ lệ đăng ký</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Không có khóa học nào
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-16 overflow-hidden rounded">
                      {course.image ? (
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-500">
                        {course.author.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {course.category?.name || "Không phân loại"}
                </TableCell>
                <TableCell>{formatPrice(course.price)}</TableCell>
                <TableCell>
                  <span className="font-medium">{getEnrollmentCount(course._id)}</span>
                </TableCell>
                <TableCell>
                  {formatPrice(getCourseRevenue(course._id, course.price))}
                </TableCell>
                <TableCell>
                  {/* Calculate percentage of total enrollments */}
                  <ProgressBar 
                    value={getEnrollmentCount(course._id)} 
                    max={Array.from(enrollmentMap.values()).reduce((a, b) => a + b, 0) || 1}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/courses/${course.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem khóa học</span>
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/course-creator/${course._id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa khóa học</span>
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      asChild
                    >
                      <Link href={getSanityStudioUrl(course._id)} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa trong Sanity Studio</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
