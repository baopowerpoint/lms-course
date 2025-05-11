"use client";

import React, { useState, useRef, useEffect } from "react";
import { Course } from "@/lib/actions/course.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

// Resource type definition
interface Resource {
  title: string;
  description?: string;
  url: string;
  type?: string;
}

// Lesson type definition
interface Lesson {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  video?: string; // URL to video (HLS format)
  resources?: Resource[];
  duration?: number;
  order?: number;
}

// Module type definition
interface Module {
  _id: string;
  title: string;
  description?: string;
  lessons?: Lesson[];
  order?: number;
}

// Updated Course type - extending the imported Course type
interface ExtendedCourse extends Course {
  modules?: Module[];
}

interface CourseContentProps {
  course: ExtendedCourse;
}

const CourseContent = ({ course }: CourseContentProps) => {
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [activeLesson, setActiveLesson] = useState<string | null>(
    course.modules?.[0]?.lessons?.[0]?._id || null
  );
  const [activeTab, setActiveTab] = useState<string>("content");

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const hasModules = course.modules && course.modules.length > 0;

  // Get the active lesson object
  const getActiveLesson = () => {
    if (!activeLesson) return null;

    for (const module of course.modules || []) {
      for (const lesson of module.lessons || []) {
        if (lesson._id === activeLesson) {
          return lesson;
        }
      }
    }

    return null;
  };

  const currentLesson = getActiveLesson();
  console.log(currentLesson);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left sidebar - course modules and lessons */}
      <Card className="lg:col-span-1 h-fit sticky top-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Nội dung khóa học</CardTitle>
          <CardDescription>
            {hasModules
              ? `${course.modules?.length || 0} phần, ${
                  course.modules?.reduce(
                    (acc, module) => acc + (module.lessons?.length || 0),
                    0
                  ) || 0
                } bài học`
              : "Nội dung đang được cập nhật"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {!hasModules && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                Nội dung của khóa học này đang được biên soạn và sẽ sớm được cập
                nhật.
              </p>
            </div>
          )}

          {hasModules && course.modules && (
            <div className="space-y-3">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={module._id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleModule(module._id)}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {moduleIndex + 1}. {module.title}
                      </span>
                    </div>
                    {expandedModules[module._id] ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>

                  {expandedModules[module._id] && module.lessons && (
                    <div className="divide-y divide-gray-100">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson._id}
                          className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            activeLesson === lesson._id ? "bg-primary/10" : ""
                          }`}
                          onClick={() => setActiveLesson(lesson._id)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 w-6">
                                {lessonIndex + 1}.
                              </span>
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                            {lesson.description && (
                              <p className="text-xs text-gray-500 mt-1 ml-6">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          {activeLesson === lesson._id && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right content - lesson content */}
      <div className="lg:col-span-3">
        {currentLesson ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{currentLesson.title}</CardTitle>
              {currentLesson.description && (
                <CardDescription>{currentLesson.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content">
                    <FileText className="h-4 w-4 mr-2" />
                    Nội dung
                  </TabsTrigger>
                  {currentLesson.video && (
                    <TabsTrigger value="video">
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </TabsTrigger>
                  )}
                  {currentLesson.resources &&
                    currentLesson.resources.length > 0 && (
                      <TabsTrigger value="resources">
                        <FileText className="h-4 w-4 mr-2" />
                        Tài liệu
                      </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="content" className="mt-0">
                  {currentLesson.content ? (
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentLesson.content,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Nội dung bài học đang được cập nhật.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {currentLesson.video && (
                  <TabsContent value="video" className="mt-0">
                    {/* Direct iframe embed for Bunny.net streams */}
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={currentLesson.video.replace(
                          "playlist.m3u8",
                          "iframe"
                        )}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${currentLesson.title} - Video bài học`}
                      ></iframe>
                    </div>

                    {/* Direct fallback options */}
                    <div className="mt-4 flex flex-col space-y-2">
                      <h3 className="text-sm font-medium">
                        Tuỳ chọn xem video
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={currentLesson.video}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Xem dạng HLS
                          </a>
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={currentLesson.video.replace(
                              "playlist.m3u8",
                              "play.mp4"
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Xem dạng MP4
                          </a>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {currentLesson.resources &&
                  currentLesson.resources.length > 0 && (
                    <TabsContent value="resources" className="mt-0">
                      <div className="space-y-3">
                        {currentLesson.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FileText className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="font-medium text-sm">
                                {resource.title}
                              </p>
                              {resource.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {resource.description}
                                </p>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </TabsContent>
                  )}
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Chọn một bài học để bắt đầu
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Chọn một bài học từ menu bên trái để bắt đầu học. Bạn có thể
                  theo dõi tiến độ học tập và quay lại bất kỳ lúc nào.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Import our universal player component
import UniversalPlayer from "@/components/players/UniversalPlayer";

// Video Player using our UniversalPlayer component
const VideoPlayer = ({ url }: { url: string }) => {
  return (
    <UniversalPlayer 
      url={url} 
      className="absolute inset-0 w-full h-full"
      onError={(error) => console.error("Video playback error:", error)}
    />
  );
};

export default CourseContent;
