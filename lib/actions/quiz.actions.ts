import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Fetch quiz data by lesson ID
export async function getQuizByLessonId(lessonId: string) {
  if (!lessonId) return null;

  try {
    const query = groq`*[_type == "lesson" && _id == $lessonId && lessonType == "quiz"][0]{
      _id,
      title,
      description,
      passingScore,
      timeLimit,
      "questions": questions[]-> {
        _id,
        content,
        type,
        points,
        explanation,
        choices[] {
          text,
          isCorrect
        },
        correctAnswer
      }
    }`;

    const quizLesson = await client.fetch(query, { lessonId });
    return quizLesson;
  } catch (error) {
    console.error("Error fetching quiz lesson:", error);
    return null;
  }
}

// Fetch quiz data by lesson slug
export async function getQuizByLessonSlug(lessonSlug: string) {
  if (!lessonSlug) return null;

  try {
    const query = groq`*[_type == "lesson" && slug.current == $lessonSlug && lessonType == "quiz"][0]{
      _id,
      title,
      description,
      passingScore,
      timeLimit,
      "questions": questions[]-> {
        _id,
        content,
        type,
        points,
        explanation,
        choices[] {
          text,
          isCorrect
        },
        correctAnswer
      }
    }`;

    const quizLesson = await client.fetch(query, { lessonSlug });
    return quizLesson;
  } catch (error) {
    console.error("Error fetching quiz lesson by slug:", error);
    return null;
  }
}

// Save quiz submission results to database
export async function saveQuizSubmission(data: {
  userId: string;
  lessonId: string;
  courseId: string;
  moduleId: string;
  score: number;
  isPassed: boolean;
  attemptDetails: any;
}) {
  try {
    // Implementation to save quiz result to database
    // This would typically be an API call to your backend
    // which stores this data in your MongoDB database
    const response = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save quiz submission");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving quiz submission:", error);
    throw error;
  }
}
