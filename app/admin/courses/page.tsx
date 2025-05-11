import { getCourses } from "@/lib/actions/course.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminCoursesTable from "@/components/admin/AdminCoursesTable";
import { Metadata } from "next";
import dbConnect from "@/lib/mongoose";
import { Enrollment } from "@/database";

export const metadata: Metadata = {
  title: "Quản lý khóa học | Admin",
  description: "Thống kê học viên theo khóa học",
};

async function getCourseEnrollments() {
  await dbConnect();
  
  // Get all enrollments and count by course
  const enrollmentCounts = await Enrollment.aggregate([
    { $group: { _id: "$course", count: { $sum: 1 } } }
  ]);
  
  // Convert to a map for easier access
  const enrollmentMap = new Map();
  enrollmentCounts.forEach((item: any) => {
    enrollmentMap.set(item._id, item.count);
  });
  
  return enrollmentMap;
}

export default async function AdminCoursesPage() {
  // Fetch courses from Sanity
  const courses = await getCourses();
  
  // Get enrollment statistics from MongoDB
  const enrollmentMap = await getCourseEnrollments();
  
  // Calculate total enrollments
  const totalEnrollments = Array.from(enrollmentMap.values()).reduce((sum: number, count: number) => sum + count, 0);
  
  // Calculate total revenue (assuming all enrollments paid the full price)
  const totalRevenue = courses.reduce((sum, course) => {
    const enrollmentCount = enrollmentMap.get(course._id) || 0;
    return sum + (course.price * enrollmentCount);
  }, 0);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thống kê khóa học</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tổng số khóa học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tổng số học viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Trung bình học viên/khóa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.length ? Math.round(totalEnrollments / courses.length) : 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tổng doanh thu ước tính</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AdminCoursesTable courses={courses} enrollmentMap={enrollmentMap} />
    </div>
  );
}
