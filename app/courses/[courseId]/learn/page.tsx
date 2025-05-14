import { getCourseById, getCourseBySlug } from "@/lib/actions/course.action";
import { checkCourseAccess } from "@/lib/actions/enrollment.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import CourseContent from "@/components/learn/CourseContent";

// Định nghĩa lại interface để phù hợp với yêu cầu của CourseContent
interface Lesson {
  _id: string;
  title: string;
  description?: string;
  lessonType: "video" | "quiz";
  videoUrl?: string;
  notes?: string;
  attachments?: { name: string; url: string }[];
  questions?: Question[];
  passingScore?: number;
  timeLimit?: number;
}

// Định nghĩa lại interface để phù hợp với các trường từ Sanity
interface SanityLesson {
  _id: string;
  title?: string;
  description?: string;
  lessonType?: "video" | "quiz";
  videoUrl?: string;
  questions?: SanityQuestion[];
  passingScore?: number;
  timeLimit?: number;
}

interface SanityQuestion {
  _id: string;
  content?: string;
  type?: string;
  points?: number;
  explanation?: string;
  choices?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string;
}

interface Question {
  _id: string;
  content: string;
  type: string;
  points: number;
  explanation?: string;
  choices?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface ExtendedCourse {
  _id: string;
  title: string;
  description: string;
  modules: Module[];
  coverImage?: string;
  author: {
    name: string;
    picture?: string;
  };
}

interface CourseLearnPageProps {
  params: {
    courseId: string;
  };
}

export async function generateMetadata({
  params,
}: CourseLearnPageProps): Promise<Metadata> {
  const courseId = params.courseId;
  const course = await getCourseBySlug(courseId);

  if (!course) {
    return {
      title: "Không tìm thấy khóa học",
      description: "Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  return {
    title: `${course.title} | Học tập`,
    description: `Học khóa học ${course.title}`,
  };
}

export default async function CourseLearnPage({ params }: RouteParams) {
  const { userId } = await auth();

  // Redirect to login if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  const { courseId } = await params;
  const course = await getCourseById(courseId);

  // Redirect if course doesn't exist
  if (!course) {
    redirect("/courses");
  }

  // Check if user has access to this course
  const hasAccess = await checkCourseAccess(course._id);

  // Redirect if user doesn't have access
  if (!hasAccess) {
    redirect(`/courses/${courseId}?access=denied`);
  }

  // Chuyển đổi dữ liệu để đảm bảo tính tương thích giữa các interface
  const adaptedCourse: ExtendedCourse = {
    _id: course._id,
    title: course.title,
    description: course.description || "",
    // Đảm bảo modules luôn là một mảng, ngay cả khi course.modules là undefined
    modules:
      course.modules?.map((module) => ({
        _id: module._id,
        title: module.title || "",
        lessons:
          module.lessons?.map((lesson: SanityLesson) => ({
            _id: lesson._id,
            title: lesson.title || "",
            description: lesson.description,
            lessonType: lesson.lessonType || "video", // Default to video if not specified
            videoUrl: lesson.videoUrl || "",
            notes: "", // Default value for notes
            attachments: [], // Default empty array for attachments
            // Convert SanityQuestion to Question with proper defaults for required fields
            questions: lesson.questions?.map(q => ({
              _id: q._id,
              content: q.content || "",
              type: q.type || "singleChoice",
              points: q.points || 1,
              explanation: q.explanation,
              choices: q.choices,
              correctAnswer: q.correctAnswer
            })) || [],
            passingScore: lesson.passingScore || 70,
            timeLimit: lesson.timeLimit || 0,
          })) || [],
      })) || [],
    coverImage: course.image,
    author: {
      name: course.author?.name || "Unknown Author",
      picture: course.author?.image || undefined,
    },
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <CourseContent course={adaptedCourse} />
    </div>
  );
}
