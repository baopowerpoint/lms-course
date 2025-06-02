"use server";
import dbConnect from "@/lib/mongoose";
import Test, { ITest } from "@/database/test.model";

// Lấy danh sách bài kiểm tra có phân trang và lọc
export async function getTests({
  page = 1,
  limit = 10,
  search = "",
  subjectId,
  gradeId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  subjectId?: number | string;
  gradeId?: number | string;
}) {
  try {
    await dbConnect();

    const skip = (page - 1) * limit;

    // Xây dựng query filter
    const filter: any = {};

    if (search) {
      // Use text index for better performance if it exists
      filter.name = { $regex: search, $options: "i" };
    }

    if (subjectId) {
      filter["subject.id"] = subjectId;
    }

    if (gradeId) {
      filter["grade.id"] = gradeId;
    }

    // Optimize query to only return what we need
    const tests = await Test.find(filter)
      .select("id name subject grade")
      .sort({ id: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Only get count when actually needed for pagination
    const total = search ? await Test.countDocuments(filter) : 0;

    return {
      tests: tests.map(test => ({
        id: test.id,
        name: test.name,
        subject: test.subject,
        grade: test.grade
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài kiểm tra:", error);
    return { tests: [], pagination: { page, limit, total: 0, totalPages: 0 } };
  }
}

// Lấy chi tiết một bài kiểm tra theo ID
export async function getTestById(id: number | string) {
  try {
    await dbConnect();

    const test = await Test.findOne({ id: Number(id) }).lean();

    return test;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bài kiểm tra:", error);
    throw error;
  }
}

// Lấy bài kiểm tra đã được gán cho một lesson
export async function getTestByLessonId(lessonId: string) {
  try {
    await dbConnect();

    const test = await Test.findOne({ lessonId }).lean();

    return test;
  } catch (error) {
    console.error("Lỗi khi lấy bài kiểm tra theo lessonId:", error);
    throw error;
  }
}

// Gán bài kiểm tra cho một lesson
export async function assignTestToLesson({
  testId,
  lessonId,
}: {
  testId: number | string;
  lessonId: string;
}) {
  try {
    await dbConnect();

    const test = await Test.findOne({ id: Number(testId) });

    if (!test) {
      throw new Error("Không tìm thấy bài kiểm tra");
    }

    test.lessonId = lessonId;
    await test.save();

    return {
      success: true,
      testId: test.id,
      testName: test.name,
    };
  } catch (error) {
    console.error("Lỗi khi gán bài kiểm tra cho bài học:", error);
    return {
      success: false,
      error: "Không thể gán bài kiểm tra cho bài học",
    };
  }
}

// Hủy gán bài kiểm tra khỏi lesson
export async function unassignTestFromLesson(lessonId: string) {
  try {
    await dbConnect();

    const test = await Test.findOne({ lessonId });

    if (!test) {
      throw new Error("Không tìm thấy bài kiểm tra được gán cho bài học này");
    }

    test.lessonId = undefined;
    await test.save();

    return {
      success: true,
      testId: test.id,
      testName: test.name,
    };
  } catch (error) {
    console.error("Lỗi khi hủy gán bài kiểm tra khỏi bài học:", error);
    throw error;
  }
}
