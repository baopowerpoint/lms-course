import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Interface để định nghĩa cấu trúc của câu hỏi
interface Question {
  id: number;
  position: number;
  title: string; // HTML content
  type: string;  // "radiogroup" thường gặp
  choices: string[];
  correctAnswer: string;
}

// Interface để định nghĩa cấu trúc của bài kiểm tra
interface Test {
  id: number;
  name: string;
  display_type: number;
  subject?: {
    id: number;
    name: string;
  };
  grade?: {
    id: number;
    name: string;
  };
  questions: Question[];
}

export async function GET(req: NextRequest) {
  try {
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

    // Phân tích dữ liệu
    const totalTests = tests.length;
    
    // Thống kê theo môn học
    const subjectStats = new Map<number, { id: number; name: string; count: number }>();
    
    // Thống kê theo lớp
    const gradeStats = new Map<number, { id: number; name: string; count: number }>();
    
    // Thống kê theo loại câu hỏi
    const questionTypeStats = new Map<string, number>();
    
    // Tổng số câu hỏi
    let totalQuestions = 0;
    
    // Phân tích chi tiết
    tests.forEach(test => {
      // Thống kê theo môn học
      if (test.subject && test.subject.id) {
        const subjectId = test.subject.id;
        if (!subjectStats.has(subjectId)) {
          subjectStats.set(subjectId, {
            id: subjectId,
            name: test.subject.name || `Môn học ${subjectId}`,
            count: 0
          });
        }
        subjectStats.get(subjectId)!.count++;
      }
      
      // Thống kê theo lớp
      if (test.grade && test.grade.id) {
        const gradeId = test.grade.id;
        if (!gradeStats.has(gradeId)) {
          gradeStats.set(gradeId, {
            id: gradeId,
            name: test.grade.name || `Lớp ${gradeId}`,
            count: 0
          });
        }
        gradeStats.get(gradeId)!.count++;
      }
      
      // Thống kê theo loại câu hỏi và tổng số câu hỏi
      if (Array.isArray(test.questions)) {
        totalQuestions += test.questions.length;
        
        test.questions.forEach((question: Question) => {
          const type = question.type || "unknown";
          questionTypeStats.set(type, (questionTypeStats.get(type) || 0) + 1);
        });
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalTests,
        totalQuestions,
        subjects: Array.from(subjectStats.values())
          .sort((a, b) => a.id - b.id),
        grades: Array.from(gradeStats.values())
          .sort((a, b) => a.id - b.id),
        questionTypes: Array.from(questionTypeStats.entries())
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
      }
    });
  } catch (error: any) {
    console.error("Lỗi khi phân tích dữ liệu bài kiểm tra:", error);
    return NextResponse.json(
      { error: `Lỗi: ${error.message}` },
      { status: 500 }
    );
  }
}
