"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { saveQuizSubmission } from "@/lib/actions/quiz.actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  content: string;
  type: string;
  points: number;
  explanation?: string;
  choices?: Choice[];
  text?: string;      // Thêm trường text để tương thích với CourseContent
  isCorrect?: boolean; // Thêm trường isCorrect để tương thích với CourseContent
  correctAnswer?: string;
}

interface QuizProps {
  lessonId: string;
  courseId: string;
  moduleId: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore?: number;
  timeLimit?: number;
  onQuizComplete?: (passed: boolean, score: number) => void;
  onNext?: () => void;
}

const QuizComponent: React.FC<QuizProps> = ({
  lessonId,
  courseId,
  moduleId,
  title,
  description,
  questions = [], // Đảm bảo questions luôn là một mảng
  passingScore = 70,
  timeLimit = 0,
  onQuizComplete,
  onNext,
}) => {
  const { user } = useUser();
  
  // Kiểm tra nếu không có câu hỏi
  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <AlertCircle className="h-16 w-16 text-orange-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Bài kiểm tra chưa sẵn sàng</h2>
        <p className="text-gray-500 mb-6">
          Bài kiểm tra đang được chuẩn bị. Vui lòng quay lại sau.
        </p>
        {onNext && (
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
            Đi đến bài tiếp theo
          </Button>
        )}
      </div>
    );
  }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer logic
  useEffect(() => {
    if (timeLimit <= 0 || showResults || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, showResults, quizSubmitted]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question._id];

      if (!userAnswer) return;

      if (question.type === "singleChoice" || question.type === "multipleChoice") {
        if (question.type === "singleChoice") {
          const correctChoice = question.choices?.find((c) => c.isCorrect);
          if (userAnswer === correctChoice?.text) {
            earnedPoints += question.points;
          }
        } else {
          // For multiple choice, calculate partial credit
          const correctChoices = question.choices?.filter((c) => c.isCorrect) || [];
          const userChoices = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          
          const correctCount = correctChoices.filter(c => 
            userChoices.includes(c.text)
          ).length;
          
          if (correctCount === correctChoices.length && 
              userChoices.length === correctChoices.length) {
            earnedPoints += question.points;
          } else if (correctCount > 0) {
            // Partial credit
            earnedPoints += (correctCount / correctChoices.length) * question.points;
          }
        }
      } else if (question.type === "fillInBlank") {
        // Case insensitive comparison for fill in the blank
        if (
          userAnswer.toLowerCase().trim() ===
          question.correctAnswer?.toLowerCase().trim()
        ) {
          earnedPoints += question.points;
        }
      }
      // For essay questions, we can't auto-grade
    });

    // Calculate percentage score
    const percentageScore = (earnedPoints / totalPoints) * 100;
    return Math.round(percentageScore);
  };

  const handleSubmit = async () => {
    if (quizSubmitted) return;
    
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);
    setQuizSubmitted(true);
    
    const isPassed = calculatedScore >= passingScore;
    
    if (onQuizComplete) {
      onQuizComplete(isPassed, calculatedScore);
    }

    // Save results to database if user is logged in
    if (user?.id) {
      try {
        await saveQuizSubmission({
          userId: user.id,
          lessonId,
          courseId,
          moduleId,
          score: calculatedScore,
          isPassed,
          attemptDetails: {
            answers,
            completedAt: new Date().toISOString(),
          },
        });
        
        toast.success("Kết quả bài kiểm tra đã được lưu");
      } catch (error) {
        console.error("Failed to save quiz results:", error);
        toast.error("Không thể lưu kết quả bài kiểm tra");
      }
    }
  };

  // Render different question types
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "singleChoice":
        return (
          <div className="space-y-3">
            <p className="font-medium text-lg">{currentQuestion.content}</p>
            <div className="space-y-2">
              {currentQuestion.choices?.map((choice, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    answers[currentQuestion._id] === choice.text
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    handleAnswer(currentQuestion._id, choice.text)
                  }
                >
                  {choice.text}
                </div>
              ))}
            </div>
          </div>
        );

      case "multipleChoice":
        return (
          <div className="space-y-3">
            <p className="font-medium text-lg">{currentQuestion.content}</p>
            <div className="space-y-2">
              {currentQuestion.choices?.map((choice, index) => {
                const selectedAnswers = answers[currentQuestion._id] || [];
                const isSelected = Array.isArray(selectedAnswers)
                  ? selectedAnswers.includes(choice.text)
                  : selectedAnswers === choice.text;

                return (
                  <div
                    key={index}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      const currentAnswers = Array.isArray(
                        answers[currentQuestion._id]
                      )
                        ? [...answers[currentQuestion._id]]
                        : answers[currentQuestion._id]
                        ? [answers[currentQuestion._id]]
                        : [];

                      const newAnswers = isSelected
                        ? currentAnswers.filter((a) => a !== choice.text)
                        : [...currentAnswers, choice.text];

                      handleAnswer(currentQuestion._id, newAnswers);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 border rounded flex items-center justify-center ${
                          isSelected ? "bg-primary border-primary" : ""
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{choice.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "fillInBlank":
        return (
          <div className="space-y-3">
            <p className="font-medium text-lg">{currentQuestion.content}</p>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="Nhập câu trả lời của bạn"
              value={answers[currentQuestion._id] || ""}
              onChange={(e) =>
                handleAnswer(currentQuestion._id, e.target.value)
              }
            />
          </div>
        );

      case "essay":
        return (
          <div className="space-y-3">
            <p className="font-medium text-lg">{currentQuestion.content}</p>
            <textarea
              className="w-full p-3 border rounded-md min-h-[150px]"
              placeholder="Nhập câu trả lời của bạn"
              value={answers[currentQuestion._id] || ""}
              onChange={(e) =>
                handleAnswer(currentQuestion._id, e.target.value)
              }
            />
          </div>
        );

      default:
        return <p>Loại câu hỏi không được hỗ trợ</p>;
    }
  };

  const renderResultsView = () => {
    const isPassed = score >= passingScore;

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center">
          {isPassed ? (
            <div className="mb-4 inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
              <Trophy className="h-12 w-12 text-green-600" />
            </div>
          ) : (
            <div className="mb-4 inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-2">
            {isPassed ? "Chúc mừng!" : "Cố gắng hơn nhé!"}
          </h2>
          <p className="text-gray-600 mb-4">
            {isPassed
              ? "Bạn đã hoàn thành bài kiểm tra này."
              : "Bạn chưa đạt điểm yêu cầu cho bài kiểm tra này."}
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Điểm số của bạn</span>
              <span className="font-bold">{score}%</span>
            </div>
            <Progress value={score} className="h-2 mb-3" />
            <div className="text-sm text-gray-500">
              Điểm đạt yêu cầu: {passingScore}%
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setQuizSubmitted(false);
              }}
            >
              Làm lại
            </Button>
            <Button onClick={onNext}>
              {isPassed ? "Tiếp tục" : "Học lại và thử lại"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {!showResults ? (
        <div>
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              {timeLimit > 0 && (
                <div className="flex items-center text-sm font-medium">
                  <Clock className="w-4 h-4 mr-1" />
                  <span
                    className={
                      timeRemaining < 60 ? "text-red-500 animate-pulse" : ""
                    }
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-600">{description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>
                  Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="p-6">{renderQuestion()}</div>

          <div className="p-6 border-t flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Câu trước
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion?._id]}
            >
              {currentQuestionIndex < totalQuestions - 1
                ? "Câu tiếp theo"
                : "Nộp bài"}
            </Button>
          </div>
        </div>
      ) : (
        renderResultsView()
      )}
    </div>
  );
};

export default QuizComponent;
