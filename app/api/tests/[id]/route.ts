import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Test from "@/database/test.model";

// Lấy chi tiết một bài kiểm tra theo ID
export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID không hợp lệ" },
        { status: 400 }
      );
    }
    
    const test = await Test.findOne({ id: Number(id) }).lean();
    
    if (!test) {
      return NextResponse.json(
        { error: "Không tìm thấy bài kiểm tra" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: test
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy chi tiết bài kiểm tra:", error);
    return NextResponse.json(
      { error: `Lỗi: ${error.message}` },
      { status: 500 }
    );
  }
}
