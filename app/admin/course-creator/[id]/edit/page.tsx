import { Metadata } from "next";
import { getCourseById } from "@/lib/actions/course.action";
import { redirect } from "next/navigation";
import CourseEditor from "@/components/admin/CourseEditor";

export const metadata: Metadata = {
  title: "Chỉnh sửa khóa học | Admin",
  description: "Chỉnh sửa thông tin khóa học, module và bài học",
};

export default async function CourseEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch course data from Sanity
  const course = await getCourseById(id);
  console.log(course);

  if (!course) {
    redirect("/admin/courses");
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa khóa học</h1>
      <p className="text-muted-foreground mb-6">
        Chỉnh sửa thông tin khóa học, module và bài học. Thêm bài kiểm tra từ
        MongoDB vào các bài học.
      </p>
      <CourseEditor course={course} />
    </div>
  );
}
