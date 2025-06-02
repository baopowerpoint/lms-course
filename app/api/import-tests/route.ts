import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Test from "@/database/test.model";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // Kết nối đến MongoDB
    await dbConnect();

    // Đọc file JSON
    const filePath = path.join(process.cwd(), "tests.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Không tìm thấy file tests.json" },
        { status: 404 }
      );
    }

    const jsonData = fs.readFileSync(filePath, "utf8");
    const tests = JSON.parse(jsonData);

    if (!Array.isArray(tests)) {
      return NextResponse.json(
        { error: "Dữ liệu không đúng định dạng. Cần là một mảng các bài kiểm tra" },
        { status: 400 }
      );
    }

    // Xử lý dữ liệu theo từng batch để tránh quá tải
    const batchSize = 100;
    const totalTests = tests.length;
    let insertedCount = 0;

    for (let i = 0; i < totalTests; i += batchSize) {
      const batch = tests.slice(i, i + batchSize);
      
      // Đảm bảo không import lại các bài kiểm tra đã tồn tại
      const operations = batch.map(test => ({
        updateOne: {
          filter: { id: test.id },
          update: { $set: test },
          upsert: true // Tạo mới nếu chưa tồn tại
        }
      }));

      const result = await Test.bulkWrite(operations);
      insertedCount += result.upsertedCount + result.modifiedCount;
    }

    return NextResponse.json({
      success: true,
      message: `Đã import ${insertedCount}/${totalTests} bài kiểm tra thành công`,
    });
  } catch (error: any) {
    console.error("Lỗi khi import bài kiểm tra:", error);
    return NextResponse.json(
      { error: `Lỗi khi import: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Đếm số lượng bài kiểm tra trong database
    const count = await Test.countDocuments();
    
    return NextResponse.json({
      success: true,
      count,
      message: `Hiện có ${count} bài kiểm tra trong ngân hàng`
    });
  } catch (error: any) {
    console.error("Lỗi khi truy vấn bài kiểm tra:", error);
    return NextResponse.json(
      { error: `Lỗi: ${error.message}` },
      { status: 500 }
    );
  }
}
