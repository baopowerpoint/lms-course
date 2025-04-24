"use client";

import { useState } from "react";
import { Chapter } from "@/lib/data/lessons";
import { Button } from "@/components/ui/button";
import { Lock, Play, ChevronDown, ChevronUp, Clock } from "lucide-react";

interface CourseContentProps {
  chapters: Chapter[];
  totalLessons: number;
  totalDuration: number;
}

export const CourseContent = ({
  chapters,
  totalLessons,
  totalDuration,
}: CourseContentProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(
    // Initially expand the first chapter
    { [chapters[0]?.id]: true }
  );

  const toggleChapter = (chapterId: string): void => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{chapters.length} chương</h3>
            <p className="text-gray-600">
              {totalLessons} bài học • {totalHours} giờ {totalMinutes > 0 ? `${totalMinutes} phút` : ""}
            </p>
          </div>
          <Button>
            Xem tất cả
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-50 text-left"
              onClick={() => toggleChapter(chapter.id)}
            >
              <div>
                <h3 className="font-medium">
                  Chương {chapter.order}: {chapter.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {chapter.lessons.length} bài học
                </p>
              </div>
              {expandedChapters[chapter.id] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedChapters[chapter.id] && (
              <div className="divide-y">
                {chapter.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-4 flex items-start ${!lesson.isFree ? "opacity-75" : ""}`}
                  >
                    <div
                      className={`flex-shrink-0 p-2 rounded-full mr-3 mt-1 ${
                        lesson.isFree
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {lesson.isFree ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">
                            {lesson.order}. {lesson.title}
                            {lesson.isFree && (
                              <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Xem thử
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {lesson.description}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{lesson.durationInMinutes} phút</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
