import { NextRequest, NextResponse } from "next/server";
import Test from "@/database/test.model";
import dbConnect from "@/lib/mongoose";

// Lấy danh sách bài kiểm tra có phân trang và lọc
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const subjectId = searchParams.get('subjectId');
    const gradeId = searchParams.get('gradeId');
    
    const skip = (page - 1) * limit;
    
    // Xây dựng query filter
    const filter: any = {};
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (subjectId) {
      filter['subject.id'] = parseInt(subjectId);
    }
    
    if (gradeId) {
      filter['grade.id'] = parseInt(gradeId);
    }
    
    // Lấy danh sách bài kiểm tra và tổng số lượng
    const [tests, total] = await Promise.all([
      Test.find(filter)
        .select('id name display_type subject grade')
        .sort({ id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Test.countDocuments(filter)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        tests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách bài kiểm tra:", error);
    return NextResponse.json(
      { error: `Lỗi: ${error.message}` },
      { status: 500 }
    );
  }
}
