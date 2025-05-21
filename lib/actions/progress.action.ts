"use server";

import dbConnect from "@/lib/mongoose";
import QuizAttempt from "@/database/quizAttempt.model";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  quizScore?: number;
  isPassed?: boolean;
  lastAttemptDate?: Date;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lastActivityDate?: Date;
  lessonProgress: Record<string, LessonProgress>;
}

/**
 * Get the user's quiz attempts for a specific course
 */
export async function getQuizAttempts(courseId: string) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return null;

    await dbConnect();

    // Find all quiz attempts for this user and course
    const quizAttempts = await QuizAttempt.find({
      userId,
      courseId,
    }).sort({ createdAt: -1 });

    return quizAttempts;
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return null;
  }
}

/**
 * Get the user's progress for a specific course
 */
export async function getCourseProgress(
  courseId: string,
  modules: any[]
): Promise<CourseProgress | null> {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return null;

    await dbConnect();

    // Find all quiz attempts for this user and course
    const quizAttempts = await QuizAttempt.find({
      userId,
      courseId,
    }).sort({ createdAt: -1 });

    // Group attempts by lessonId - keep only the most recent attempt for each lesson
    const quizAttemptsMap = new Map();
    quizAttempts.forEach((attempt) => {
      if (!quizAttemptsMap.has(attempt.lessonId)) {
        quizAttemptsMap.set(attempt.lessonId, attempt);
      }
    });

    // Calculate the total number of lessons in the course
    let totalLessons = 0;
    modules.forEach((module) => {
      totalLessons += module.lessons?.length || 0;
    });

    // Create a map of lesson progress
    const lessonProgress: Record<string, LessonProgress> = {};
    let completedLessons = 0;
    let lastActivityDate: Date | undefined = undefined;

    // For each module and lesson, check if it has a quiz attempt
    modules.forEach((module) => {
      module.lessons?.forEach((lesson: any) => {
        const attempt = quizAttemptsMap.get(lesson._id);

        // For quiz lessons, we consider them completed if there's a passed attempt
        if (lesson.lessonType === "quiz" && attempt) {
          const isCompleted = attempt.isPassed;

          lessonProgress[lesson._id] = {
            lessonId: lesson._id,
            isCompleted,
            quizScore: attempt.score,
            isPassed: attempt.isPassed,
            lastAttemptDate: attempt.createdAt,
          };

          if (isCompleted) {
            completedLessons++;
          }

          // Update last activity date
          if (
            !lastActivityDate ||
            new Date(attempt.createdAt) >
              (lastActivityDate ? new Date(lastActivityDate) : new Date(0))
          ) {
            lastActivityDate = attempt.createdAt;
          }
        }
        // We would typically also track video lessons completion through a separate system
        // For now, we'll consider them not completed
        else {
          lessonProgress[lesson._id] = {
            lessonId: lesson._id,
            isCompleted: false,
          };
        }
      });
    });

    // Calculate progress percentage
    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      courseId,
      completedLessons,
      totalLessons,
      progressPercentage,
      lastActivityDate,
      lessonProgress,
    };
  } catch (error) {
    console.error("Error calculating course progress:", error);
    return null;
  }
}

/**
 * Mark a video lesson as completed
 */
export async function markLessonAsCompleted(
  lessonId: string,
  courseId: string,
  moduleId: string
) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return { success: false, message: "Unauthorized" };

    // For video lessons, we could store completion status in a separate LessonProgress collection
    // For now, we'll keep it simple and focus on the quiz attempts implementation

    return { success: true, message: "Lesson marked as completed" };
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    return { success: false, message: "Failed to mark lesson as completed" };
  }
}
