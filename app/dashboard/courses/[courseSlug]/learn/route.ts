import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseSlug: string } }
) {
  const courseId = params.courseSlug; // courseSlug in this context is really an ID
  
  // Chuyển hướng đến route mới thống nhất
  return NextResponse.redirect(
    new URL(`/courses/${courseId}/learn`, request.url)
  );
}
