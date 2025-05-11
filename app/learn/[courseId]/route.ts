import { getCourseById } from "@/lib/actions/course.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const courseId = params.courseId;

  try {
    // Lấy thông tin khóa học từ ID
    const course = await getCourseById(courseId);

    if (!course) {
      // Nếu không tìm thấy khóa học, chuyển hướng đến trang danh sách khóa học
      return NextResponse.redirect(new URL("/courses", request.url));
    }

    // Xử lý slug một cách an toàn
    const courseSlug =
      typeof course.slug === "string"
        ? course.slug
        : course.slug?.current || courseId;

    // Chuyển hướng đến route mới sử dụng slug
    return NextResponse.redirect(
      new URL(`/courses/${courseSlug}/learn`, request.url)
    );
  } catch (error) {
    console.error("Error in course redirect:", error);
    // Trong trường hợp lỗi, chuyển hướng về trang danh sách khóa học
    return NextResponse.redirect(new URL("/courses", request.url));
  }
}
