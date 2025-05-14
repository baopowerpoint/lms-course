"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getCourseProgress } from "@/lib/actions/progress.action";
import {
  BarChart2,
  BookOpen,
  CalendarClock,
  FileQuestion,
  Medal,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import QuizProgressList from "@/components/dashboard/QuizProgressList";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  courseImage?: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lastActivityDate?: Date;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  
  interface QuizAttempt {
    id: string;
    lessonId: string;
    courseId: string;
    title: string;
    courseTitle: string;
    score: number;
    isPassed: boolean;
    completedAt: string;
  }
  
  interface PendingQuiz {
    id: string;
    lessonId: string;
    courseId: string;
    title: string;
    courseTitle: string;
    passingScore: number;
    timeLimit: number;
  }
  
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [pendingQuizzes, setPendingQuizzes] = useState<PendingQuiz[]>([]);

  useEffect(() => {
    // In a real app, this would load actual data from the server
    // This is just mock data for the UI demo
    const mockCourseProgress = [
      {
        courseId: "course1",
        courseTitle: "Toán học cơ bản lớp 5",
        courseImage: "/images/course1.jpg",
        completedLessons: 8,
        totalLessons: 12,
        progressPercentage: 66,
        lastActivityDate: new Date(2025, 4, 10),
      },
      {
        courseId: "course2",
        courseTitle: "Luyện tập phép cộng trừ",
        courseImage: "/images/course2.jpg",
        completedLessons: 4,
        totalLessons: 10,
        progressPercentage: 40,
        lastActivityDate: new Date(2025, 4, 8),
      },
    ];

    const mockQuizAttempts = [
      {
        id: "quiz1",
        lessonId: "lesson1",
        courseId: "course1",
        title: "Bài kiểm tra: Phép cộng và phép trừ",
        courseTitle: "Toán học cơ bản lớp 5",
        score: 85,
        isPassed: true,
        completedAt: new Date(2025, 4, 10).toISOString(),
      },
      {
        id: "quiz2",
        lessonId: "lesson2",
        courseId: "course1",
        title: "Bài kiểm tra: Phân số",
        courseTitle: "Toán học cơ bản lớp 5",
        score: 60,
        isPassed: false,
        completedAt: new Date(2025, 4, 9).toISOString(),
      },
    ];

    const mockPendingQuizzes = [
      {
        id: "quiz3",
        lessonId: "lesson3",
        courseId: "course1",
        title: "Bài kiểm tra: Phép nhân và phép chia",
        courseTitle: "Toán học cơ bản lớp 5",
        passingScore: 70,
        timeLimit: 15,
      },
      {
        id: "quiz4",
        lessonId: "lesson4",
        courseId: "course2",
        title: "Bài kiểm tra: Giải toán có lời văn",
        courseTitle: "Luyện tập phép cộng trừ",
        passingScore: 80,
        timeLimit: 20,
      },
    ];

    setCourseProgress(mockCourseProgress);
    setQuizAttempts(mockQuizAttempts);
    setPendingQuizzes(mockPendingQuizzes);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/4 my-6"></div>
            <div className="h-80 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">
            Xin chào, {user?.firstName || "Học viên"}!
          </h1>
          <Link href="/quiz-demo">
            <Button className="bg-primary hover:bg-primary/90">
              <FileQuestion className="mr-2 h-4 w-4" />
              Xem demo bài kiểm tra
            </Button>
          </Link>
        </div>

        {/* Stats overview */}
        {/* Subscription Status Widget */}
        <div className="col-span-full mb-8">
          <SubscriptionStatus />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Khóa học đang học
              </p>
              <h3 className="text-2xl font-bold">{courseProgress.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Medal className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Điểm trung bình
              </p>
              <h3 className="text-2xl font-bold">
                {quizAttempts.length > 0
                  ? Math.round(
                      quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) /
                        quizAttempts.length
                    )
                  : 0}
                %
              </h3>
              <ul className="space-y-1">
                {quizAttempts.slice(0, 3).map((quiz) => (
                  <li key={quiz.id} className="text-sm flex justify-between">
                    <span className="truncate">{quiz.title}</span>
                    <span
                      className={`${quiz.score >= 80 ? "text-green-500" : "text-orange-500"}`}
                    >
                      {quiz.score}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <FileQuestion className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Bài kiểm tra chưa làm
              </p>
              <h3 className="text-2xl font-bold">{pendingQuizzes.length}</h3>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <h2 className="text-xl font-bold mb-4">Tiến độ học tập</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {courseProgress.map((course) => (
            <div
              key={course.courseId}
              className="bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">{course.courseTitle}</h3>
                <div className="text-sm text-gray-500 flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  <span>
                    Học gần nhất:{" "}
                    {course.lastActivityDate?.toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Tiến độ học tập</span>
                  <span className="font-medium">
                    {course.progressPercentage}%
                  </span>
                </div>
                <Progress
                  value={course.progressPercentage}
                  className="h-2 mb-4"
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {course.completedLessons}
                    </span>{" "}
                    / {course.totalLessons} bài học hoàn thành
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/courses/${course.courseId}/learn`}>
                      Tiếp tục học
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Progress */}
        <QuizProgressList
          attempts={quizAttempts}
          pendingQuizzes={pendingQuizzes}
        />
      </div>
    </div>
  );
}
