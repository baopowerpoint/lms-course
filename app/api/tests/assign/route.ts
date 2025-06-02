import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Test from "@/database/test.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { testId, lessonId } = body;

    if (!testId || !lessonId) {
      return NextResponse.json(
        { error: "Thiếu thông tin testId hoặc lessonId" },
        { status: 400 }
      );
    }

    // Kiểm tra xem bài kiểm tra có tồn tại không
    const test = await Test.findOne({ id: Number(testId) });

    if (!test) {
      return NextResponse.json(
        { error: "Không tìm thấy bài kiểm tra" },
        { status: 404 }
      );
    }

    // Cập nhật lessonId cho bài kiểm tra
    test.lessonId = lessonId;
    await test.save();

    return NextResponse.json({
      success: true,
      message: "Đã gán bài kiểm tra cho bài học thành công",
      data: {
        testId: test.id,
        lessonId,
        testName: test.name,
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi gán bài kiểm tra cho bài học:", error);
    return NextResponse.json(
      { error: `Lỗi: ${error.message}` },
      { status: 500 }
    );
  }
}
