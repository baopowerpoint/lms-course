"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const QuizDemoPage = () => {
  const [activeTab, setActiveTab] = useState("single-choice");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [essayAnswer, setEssayAnswer] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    setShowResults(true);
    toast.success("Bài kiểm tra đã được nộp!");
  };

  const resetDemo = () => {
    setSelectedAnswer(null);
    setMultipleAnswers([]);
    setTextAnswer("");
    setEssayAnswer("");
    setShowResults(false);
  };

  const toggleMultipleChoice = (choice: string) => {
    if (multipleAnswers.includes(choice)) {
      setMultipleAnswers(multipleAnswers.filter((c) => c !== choice));
    } else {
      setMultipleAnswers([...multipleAnswers, choice]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="bg-primary/10 p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <Link href="/courses" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Quay lại khóa học
              </Link>
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>Thời gian còn lại: 14:32</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bài kiểm tra: Phép cộng và phép trừ</h1>
            <p className="text-gray-600 mt-1">Hoàn thành bài kiểm tra này để tiếp tục bài học tiếp theo.</p>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Câu hỏi 2/10</span>
                <span>20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
          </div>

          {/* Question Types Demo */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Các loại câu hỏi</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="single-choice">Trắc nghiệm</TabsTrigger>
                  <TabsTrigger value="multiple-choice">Nhiều đáp án</TabsTrigger>
                  <TabsTrigger value="fill-blank">Điền khuyết</TabsTrigger>
                  <TabsTrigger value="essay">Tự luận</TabsTrigger>
                </TabsList>

                {/* Single Choice Question */}
                <TabsContent value="single-choice">
                  <div className="space-y-4">
                    <div className="text-lg font-medium">
                      Kết quả của phép tính 15 + 7 là:
                    </div>
                    
                    {["21", "22", "23", "24"].map((answer) => (
                      <div
                        key={answer}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAnswer === answer
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-gray-50"
                        } ${
                          showResults && answer === "22"
                            ? "bg-green-50 border-green-500"
                            : ""
                        } ${
                          showResults && selectedAnswer === answer && answer !== "22"
                            ? "bg-red-50 border-red-500"
                            : ""
                        }`}
                        onClick={() => !showResults && setSelectedAnswer(answer)}
                      >
                        <div className="flex items-center justify-between">
                          <div>{answer}</div>
                          {showResults && answer === "22" && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {showResults && selectedAnswer === answer && answer !== "22" && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}

                    {showResults && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Giải thích:</h3>
                        <p>15 + 7 = 22</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Multiple Choice Question */}
                <TabsContent value="multiple-choice">
                  <div className="space-y-4">
                    <div className="text-lg font-medium">
                      Chọn các số là số chẵn:
                    </div>
                    
                    {["2", "3", "4", "5", "6"].map((answer) => (
                      <div
                        key={answer}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          multipleAnswers.includes(answer)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-gray-50"
                        } ${
                          showResults && ["2", "4", "6"].includes(answer)
                            ? "bg-green-50 border-green-500"
                            : ""
                        } ${
                          showResults &&
                          multipleAnswers.includes(answer) &&
                          !["2", "4", "6"].includes(answer)
                            ? "bg-red-50 border-red-500"
                            : ""
                        }`}
                        onClick={() => !showResults && toggleMultipleChoice(answer)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`w-5 h-5 mr-3 border rounded flex items-center justify-center ${
                                multipleAnswers.includes(answer)
                                  ? "bg-primary border-primary"
                                  : ""
                              }`}
                            >
                              {multipleAnswers.includes(answer) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-white"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <div>{answer}</div>
                          </div>
                          {showResults && ["2", "4", "6"].includes(answer) && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}

                    {showResults && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Giải thích:</h3>
                        <p>Các số chẵn trong dãy số là: 2, 4, 6</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Fill in the Blank Question */}
                <TabsContent value="fill-blank">
                  <div className="space-y-4">
                    <div className="text-lg font-medium">
                      Điền kết quả của phép tính: 12 x 8 = ?
                    </div>
                    
                    <input
                      type="text"
                      value={textAnswer}
                      onChange={(e) => !showResults && setTextAnswer(e.target.value)}
                      className={`w-full p-3 border rounded-md ${
                        showResults && textAnswer === "96"
                          ? "bg-green-50 border-green-500"
                          : showResults
                          ? "bg-red-50 border-red-500"
                          : ""
                      }`}
                      placeholder="Nhập câu trả lời của bạn"
                      disabled={showResults}
                    />

                    {showResults && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Giải thích:</h3>
                        <p>12 x 8 = 96</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Essay Question */}
                <TabsContent value="essay">
                  <div className="space-y-4">
                    <div className="text-lg font-medium">
                      Trình bày các bước để giải phương trình bậc hai: ax² + bx + c = 0
                    </div>
                    
                    <textarea
                      value={essayAnswer}
                      onChange={(e) => !showResults && setEssayAnswer(e.target.value)}
                      className="w-full p-3 border rounded-md min-h-[150px]"
                      placeholder="Nhập câu trả lời của bạn"
                      disabled={showResults}
                    />

                    {showResults && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Gợi ý đáp án:</h3>
                        <ol className="list-decimal ml-5 space-y-2">
                          <li>Tính delta (Δ) theo công thức: Δ = b² - 4ac</li>
                          <li>Nếu Δ &lt; 0: Phương trình vô nghiệm</li>
                          <li>Nếu Δ = 0: Phương trình có nghiệm kép x = -b/(2a)</li>
                          <li>Nếu Δ &gt; 0: Phương trình có hai nghiệm phân biệt x₁ = (-b + √Δ)/(2a) và x₂ = (-b - √Δ)/(2a)</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex justify-between">
            <Button variant="outline" onClick={resetDemo} disabled={!showResults}>
              Làm lại
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Câu trước
              </Button>
              
              {!showResults ? (
                <Button onClick={handleSubmit}>
                  Nộp bài
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button>
                  Câu tiếp theo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Results Modal */}
          {showResults && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={resetDemo}>
              <div className="bg-white p-8 rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Chúc mừng!</h2>
                  <p className="text-gray-600 mb-6">
                    Bạn đã hoàn thành bài kiểm tra này.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Điểm số của bạn</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <Progress value={85} className="h-2 mb-3" />
                    <div className="text-sm text-gray-500">
                      Điểm đạt yêu cầu: 70%
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={resetDemo}>
                      Làm lại
                    </Button>
                    <Button asChild>
                      <Link href="/courses">Tiếp tục</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDemoPage;
