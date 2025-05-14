"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  PlayCircle,
  FileText,
  Download,
  FileQuestion,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import UniversalPlayer from "@/components/players/UniversalPlayer";
import QuizComponent from "./QuizComponent";
import {
  getCourseProgress,
  markLessonAsCompleted,
} from "@/lib/actions/progress.action";
import { toast } from "sonner";

interface Question {
  _id: string;
  content: string;
  type: string;
  points: number;
  explanation?: string;
  choices?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string;
}

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

interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  quizScore?: number;
  isPassed?: boolean;
  lastAttemptDate?: Date;
}

interface CourseProgressData {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lastActivityDate?: Date;
  lessonProgress: Record<string, LessonProgress>;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
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

interface CourseContentProps {
  course: Course;
}

const CourseContent = ({ course }: CourseContentProps) => {
  // State for tracking the active module and lesson
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const activeModule = course.modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons[activeLessonIndex];

  // State for tracking course progress
  const [progressData, setProgressData] = useState<CourseProgressData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  console.log(activeLesson);
  // Fetch progress data when component mounts or active lesson changes
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const progress = await getCourseProgress(course._id, course.modules);
        setProgressData(progress);
      } catch (error) {
        console.error("Error fetching course progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [course._id, activeLesson]);

  // Calculate progress percentage
  const progress = progressData?.progressPercentage || 0;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container max-w-screen-xl py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {course.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Tiến độ: </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-28">
                <Progress value={progress} className="h-2.5" />
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/courses">Quay lại</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Modules and Lessons List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-4">Nội dung khóa học</h2>

            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={module._id}
                  className="border rounded-md overflow-hidden"
                >
                  <div
                    className={`p-3 font-medium cursor-pointer ${
                      activeModuleIndex === moduleIndex
                        ? "bg-primary text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveModuleIndex(moduleIndex)}
                  >
                    {module.title}
                  </div>

                  {activeModuleIndex === moduleIndex && (
                    <div className="divide-y">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson._id}
                          className={`p-3 pl-6 text-sm cursor-pointer flex items-center gap-2 ${
                            activeLessonIndex === lessonIndex &&
                            activeModuleIndex === moduleIndex
                              ? "bg-primary/5"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setActiveLessonIndex(lessonIndex);
                          }}
                        >
                          {/* Status icon based on lesson type and completion */}
                          {progressData?.lessonProgress[lesson._id]
                            ?.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : lesson.lessonType === "quiz" ? (
                            progressData?.lessonProgress[lesson._id]
                              ?.quizScore !== undefined ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            ) : (
                              <FileQuestion className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            )
                          ) : (
                            <PlayCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                          {/* Show quiz score if available */}
                          {progressData?.lessonProgress[lesson._id]
                            ?.quizScore !== undefined && (
                            <span className="ml-auto text-xs font-medium">
                              {
                                progressData.lessonProgress[lesson._id]
                                  .quizScore
                              }
                              %
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Content based on lesson type */}
            {activeLesson?.lessonType === "video" ? (
              // Video Player
              activeLesson?.videoUrl ? (
                <div className="aspect-video bg-black relative">
                  <UniversalPlayer
                    url={activeLesson.videoUrl}
                    title={activeLesson.title}
                    className="w-full h-full"
                    onError={(error) =>
                      console.error("Video playback error:", error)
                    }
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Bài học này không có video</p>
                </div>
              )
            ) : activeLesson?.lessonType === "quiz" ? (
              // Quiz Component
              <div>
                <QuizComponent
                  lessonId={activeLesson._id}
                  courseId={course._id}
                  moduleId={activeModule._id}
                  title={activeLesson.title}
                  description={activeLesson.description}
                  questions={activeLesson.questions || []}
                  passingScore={activeLesson.passingScore}
                  timeLimit={activeLesson.timeLimit}
                  onQuizComplete={(passed, score) => {
                    console.log(
                      `Quiz completed with score ${score}. Passed: ${passed}`
                    );
                    // Refresh progress data after quiz completion
                    getCourseProgress(course._id, course.modules).then(
                      (data) => {
                        setProgressData(data);
                        if (passed) {
                          toast.success(
                            "Chúc mừng! Bạn đã hoàn thành bài kiểm tra"
                          );
                        } else {
                          toast.info("Bạn chưa đạt điểm yêu cầu. Hãy thử lại!");
                        }
                      }
                    );
                  }}
                  onNext={() => {
                    // Navigate to next lesson when quiz is completed
                    if (activeLessonIndex < activeModule.lessons.length - 1) {
                      setActiveLessonIndex(activeLessonIndex + 1);
                    } else if (activeModuleIndex < course.modules.length - 1) {
                      setActiveModuleIndex(activeModuleIndex + 1);
                      setActiveLessonIndex(0);
                    }
                  }}
                />
              </div>
            ) : (
              // Fallback for unknown lesson type
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                  Không thể hiển thị nội dung bài học này
                </p>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{activeLesson?.title}</h2>

              {/* Only show tabs for video lessons */}
              {activeLesson?.lessonType === "video" && (
                <Tabs defaultValue="content" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="content">Nội dung</TabsTrigger>
                    <TabsTrigger value="notes">Ghi chú</TabsTrigger>
                    <TabsTrigger value="attachments">Tài liệu</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="pt-4">
                    <div className="prose max-w-none">
                      {activeLesson?.description ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: activeLesson.description,
                          }}
                        />
                      ) : (
                        <p className="text-gray-500">
                          Bài học này không có mô tả chi tiết.
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="pt-4">
                    <div className="prose max-w-none">
                      {activeLesson?.notes ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: activeLesson.notes,
                          }}
                        />
                      ) : (
                        <p className="text-gray-500">
                          Bài học này không có ghi chú.
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="attachments" className="pt-4">
                    {activeLesson?.attachments &&
                    activeLesson.attachments.length > 0 ? (
                      <div className="space-y-3">
                        {activeLesson.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <span>{attachment.name}</span>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Tải xuống
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Bài học này không có tài liệu đính kèm.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              )}

              {/* Only show navigation controls for video lessons, quiz has its own controls */}
              {activeLesson?.lessonType === "video" && (
                <div className="mt-8 flex justify-between items-center">
                  {/* Complete Lesson Button */}
                  <Button
                    onClick={async () => {
                      const result = await markLessonAsCompleted(
                        activeLesson._id,
                        course._id,
                        activeModule._id
                      );

                      if (result.success) {
                        toast.success("Đã đánh dấu hoàn thành bài học");
                        // Refresh progress data
                        const progress = await getCourseProgress(
                          course._id,
                          course.modules
                        );
                        setProgressData(progress);
                      } else {
                        toast.error("Không thể đánh dấu hoàn thành bài học");
                      }
                    }}
                    disabled={
                      progressData?.lessonProgress[activeLesson._id]
                        ?.isCompleted
                    }
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {progressData?.lessonProgress[activeLesson._id]?.isCompleted
                      ? "Đã hoàn thành"
                      : "Đánh dấu hoàn thành"}
                  </Button>

                  {/* Navigation Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={
                        activeLessonIndex === 0 && activeModuleIndex === 0
                      }
                      onClick={() => {
                        if (activeLessonIndex > 0) {
                          setActiveLessonIndex(activeLessonIndex - 1);
                        } else if (activeModuleIndex > 0) {
                          setActiveModuleIndex(activeModuleIndex - 1);
                          setActiveLessonIndex(
                            course.modules[activeModuleIndex - 1].lessons
                              .length - 1
                          );
                        }
                      }}
                    >
                      Bài trước
                    </Button>

                    <Button
                      disabled={
                        activeModuleIndex === course.modules.length - 1 &&
                        activeLessonIndex === activeModule.lessons.length - 1
                      }
                      onClick={() => {
                        if (
                          activeLessonIndex <
                          activeModule.lessons.length - 1
                        ) {
                          setActiveLessonIndex(activeLessonIndex + 1);
                        } else if (
                          activeModuleIndex <
                          course.modules.length - 1
                        ) {
                          setActiveModuleIndex(activeModuleIndex + 1);
                          setActiveLessonIndex(0);
                        }
                      }}
                    >
                      Bài tiếp theo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
