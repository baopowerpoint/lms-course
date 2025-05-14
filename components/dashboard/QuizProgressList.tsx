"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  BarChart2,
  Trophy,
  FileQuestion,
  ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface QuizProgressListProps {
  attempts: QuizAttempt[];
  pendingQuizzes: {
    id: string;
    lessonId: string;
    courseId: string;
    title: string;
    courseTitle: string;
    passingScore: number;
    timeLimit: number | null;
  }[];
}

export default function QuizProgressList({
  attempts = [],
  pendingQuizzes = []
}: QuizProgressListProps) {
  const [activeTab, setActiveTab] = useState("pending");

  // Sort attempts by completion date (newest first)
  const sortedAttempts = [...attempts].sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  
  // Split attempts into passed and failed
  const passedAttempts = sortedAttempts.filter(attempt => attempt.isPassed);
  const failedAttempts = sortedAttempts.filter(attempt => !attempt.isPassed);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-primary/5">
        <h2 className="text-lg font-medium flex items-center">
          <FileQuestion className="h-5 w-5 mr-2 text-primary" />
          Bài kiểm tra
        </h2>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Chưa làm
              {pendingQuizzes.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingQuizzes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="passed">
              Đã hoàn thành
              {passedAttempts.length > 0 && (
                <span className="absolute top-1 right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {passedAttempts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="failed">
              Cần làm lại
              {failedAttempts.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {failedAttempts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="p-4">
          {pendingQuizzes.length > 0 ? (
            <div className="space-y-4">
              {pendingQuizzes.map((quiz) => (
                <div key={quiz.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{quiz.title}</h3>
                      <p className="text-sm text-gray-600">{quiz.courseTitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {quiz.timeLimit && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{quiz.timeLimit} phút</span>
                        </div>
                      )}
                      <Button asChild size="sm">
                        <Link href={`/courses/${quiz.courseId}/learn?lessonId=${quiz.lessonId}`}>
                          Bắt đầu làm
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="flex items-center text-amber-600">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>Điểm đạt yêu cầu: {quiz.passingScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileQuestion className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Không có bài kiểm tra nào cần làm</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="passed" className="p-4">
          {passedAttempts.length > 0 ? (
            <div className="space-y-4">
              {passedAttempts.map((attempt) => (
                <div key={attempt.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                        {attempt.title}
                      </h3>
                      <p className="text-sm text-gray-600">{attempt.courseTitle}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <BarChart2 className="h-4 w-4 mr-1 text-primary" />
                        <span className="font-bold">{attempt.score}%</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(attempt.completedAt)}
                      </span>
                    </div>
                  </div>
                  <Progress value={attempt.score} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Bạn chưa hoàn thành bài kiểm tra nào</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="failed" className="p-4">
          {failedAttempts.length > 0 ? (
            <div className="space-y-4">
              {failedAttempts.map((attempt) => (
                <div key={attempt.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <XCircle className="h-4 w-4 mr-1 text-red-600" />
                        {attempt.title}
                      </h3>
                      <p className="text-sm text-gray-600">{attempt.courseTitle}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <BarChart2 className="h-4 w-4 mr-1 text-red-600" />
                          <span className="font-bold">{attempt.score}%</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(attempt.completedAt)}
                        </span>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/courses/${attempt.courseId}/learn?lessonId=${attempt.lessonId}`}>
                          Làm lại
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <Progress value={attempt.score} className="h-2 bg-red-200" 
                    indicatorClassName="bg-red-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Bạn chưa có bài kiểm tra nào cần làm lại</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
