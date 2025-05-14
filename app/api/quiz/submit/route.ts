import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/db";
import QuizAttempt from "@/database/quizAttempt.model";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    // Return error if not authenticated
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get quiz submission data from request body
    const body = await req.json();
    const {
      lessonId,
      courseId,
      moduleId,
      score,
      isPassed,
      attemptDetails,
    } = body;

    // Validate required fields
    if (!lessonId || !courseId || !moduleId || score === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Create a new quiz attempt
    const quizAttempt = await QuizAttempt.create({
      userId,
      lessonId,
      courseId,
      moduleId,
      score,
      isPassed,
      attemptDetails,
    });

    return NextResponse.json({
      success: true,
      message: "Quiz submission saved successfully",
      data: {
        id: quizAttempt._id,
        score,
        isPassed,
      },
    });
  } catch (error) {
    console.error("Error saving quiz submission:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save quiz submission" },
      { status: 500 }
    );
  }
}
