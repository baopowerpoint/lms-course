"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  Download,
  Clipboard,
  Check,
  Loader2,
  BookOpen,
  Video,
  FileText,
  Trash2,
  RefreshCcw,
  ArrowDownUp,
} from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  title: string;
  videoUrl: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Lecture {
  title: string;
  videoUrl: string;
  chapter?: string;
}

export default function JsonConverterPage() {
  const [inputText, setInputText] = useState("");
  const [parsedLessons, setParsedLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleTitle, setCurrentModuleTitle] = useState("Module 1");
  const [outputJson, setOutputJson] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remainingLessons, setRemainingLessons] = useState<Lesson[]>([]);

  // State for the lectures cleaning tab
  const [lecturesJson, setLecturesJson] = useState("");
  const [cleanedLectures, setCleanedLectures] = useState("");
  const [isParsingSrc, setIsParsingSrc] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [copiedClean, setCopiedClean] = useState(false);
  
  // Parse the input text into lessons
  const parseInputText = () => {
    setIsParsing(true);
    try {
      const lines = inputText.split("\n");
      const lessons: Lesson[] = [];
      
      for (let i = 0; i < lines.length; i += 3) {
        const title = lines[i]?.trim();
        const videoUrl = lines[i + 1]?.trim();
        
        if (title && videoUrl) {
          // Basic URL validation
          if (videoUrl.startsWith("http")) {
            lessons.push({ title, videoUrl });
          }
        }
      }
      
      setParsedLessons(lessons);
      setRemainingLessons(lessons);
      setCurrentLessonIndex(0);
      toast.success(`Đã phân tích thành công ${lessons.length} bài học`);
    } catch (error) {
      console.error("Error parsing input:", error);
      toast.error("Lỗi khi phân tích dữ liệu đầu vào");
    } finally {
      setIsParsing(false);
    }
  };
  
  // Add a new empty module
  const addModule = () => {
    if (currentModuleTitle.trim() === "") {
      toast.error("Tên module không được để trống");
      return;
    }
    
    setModules(prevModules => [
      ...prevModules, 
      { title: currentModuleTitle, lessons: [] }
    ]);
    
    // Increment module number for next one
    const moduleNumber = parseInt(currentModuleTitle.replace(/[^0-9]/g, "")) || modules.length + 1;
    setCurrentModuleTitle(`Module ${moduleNumber + 1}`);
  };
  
  // Add the current lesson to the last module
  const addLessonToModule = (moduleIndex: number) => {
    if (remainingLessons.length === 0) {
      toast.error("Không còn bài học nào để thêm");
      return;
    }
    
    const lesson = remainingLessons[0];
    
    setModules(prevModules => {
      const updatedModules = [...prevModules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        lessons: [...updatedModules[moduleIndex].lessons, lesson]
      };
      return updatedModules;
    });
    
    // Remove the lesson from the remaining list
    setRemainingLessons(prevLessons => prevLessons.slice(1));
  };
  
  // Remove a lesson from a module
  const removeLessonFromModule = (moduleIndex: number, lessonIndex: number) => {
    const moduleToUpdate = modules[moduleIndex];
    const lessonToRemove = moduleToUpdate.lessons[lessonIndex];
    
    // Add the removed lesson back to the remaining lessons
    setRemainingLessons(prevLessons => [lessonToRemove, ...prevLessons]);
    
    // Remove the lesson from the module
    setModules(prevModules => {
      const updatedModules = [...prevModules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        lessons: updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
      };
      return updatedModules;
    });
  };
  
  // Delete an entire module
  const deleteModule = (moduleIndex: number) => {
    const moduleToDelete = modules[moduleIndex];
    
    // Add all lessons from this module back to remaining lessons
    setRemainingLessons(prevLessons => [
      ...moduleToDelete.lessons,
      ...prevLessons
    ]);
    
    // Remove the module
    setModules(prevModules => 
      prevModules.filter((_, i) => i !== moduleIndex)
    );
  };
  
  // Generate the output JSON
  const generateOutput = () => {
    if (modules.length === 0) {
      toast.error("Chưa có module nào để tạo JSON");
      return;
    }
    
    const output = {
      modules: modules
    };
    
    setOutputJson(JSON.stringify(output, null, 2));
  };
  
  // Copy the output to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputJson);
      setCopied(true);
      toast.success("Đã sao chép vào clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Không thể sao chép vào clipboard");
    }
  };

  // Validate JSON string before parsing
  const validateJsonString = (jsonString: string): boolean => {
    if (!jsonString.trim()) return false;
    
    // Make sure it starts with a { character
    if (!jsonString.trim().startsWith('{')) {
      toast.error("JSON phải bắt đầu với dấu '{'");
      return false;
    }
    
    try {
      // Try a preliminary parse
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Lỗi JSON: ${error.message}`);
      } else {
        toast.error("JSON không hợp lệ");
      }
      return false;
    }
  };
  
  // Parse lectures JSON
  const parseLecturesJson = () => {
    setIsParsingSrc(true);
    
    // Trim the input first
    const trimmedJson = lecturesJson.trim();
    
    // Validate JSON before trying to parse
    if (!validateJsonString(trimmedJson)) {
      setIsParsingSrc(false);
      return;
    }
    
    try {
      const data = JSON.parse(trimmedJson);
      
      if (!data.lectures) {
        toast.error("Dữ liệu JSON không có trường 'lectures'");
        setIsParsingSrc(false);
        return;
      }
      
      if (!Array.isArray(data.lectures)) {
        toast.error("Trường 'lectures' phải là một mảng");
        setIsParsingSrc(false);
        return;
      }
      
      const lectures: Lecture[] = data.lectures;
      
      if (lectures.length === 0) {
        toast.error("Mảng 'lectures' không có dữ liệu");
        setIsParsingSrc(false);
        return;
      }
      
      setIsParsingSrc(false);
      toast.success(`Đã phân tích thành công ${lectures.length} bài giảng`);
      
      // Start cleaning process
      cleanLectures(lectures);
    } catch (error) {
      console.error("Error parsing lectures JSON:", error);
      if (error instanceof Error) {
        toast.error(`Lỗi khi phân tích JSON: ${error.message}`);
      } else {
        toast.error("Lỗi khi phân tích dữ liệu JSON");
      }
      setIsParsingSrc(false);
    }
  };

  // Clean lectures data
  const cleanLectures = (lectures: Lecture[]) => {
    setIsCleaning(true);
    try {
      // Convert lectures to the desired format
      const formattedText = lectures.map(lecture => {
        return `${lecture.title}\n${lecture.videoUrl}`;
      }).join("\n\n");
      
      setCleanedLectures(formattedText);
      toast.success("Dữ liệu đã được chuyển đổi thành công!");
    } catch (error) {
      console.error("Error cleaning lectures:", error);
      toast.error("Lỗi khi chuyển đổi dữ liệu");
    } finally {
      setIsCleaning(false);
    }
  };

  // Copy cleaned lectures to clipboard
  const copyCleanedText = async () => {
    try {
      await navigator.clipboard.writeText(cleanedLectures);
      setCopiedClean(true);
      toast.success("Đã sao chép vào clipboard");
      setTimeout(() => setCopiedClean(false), 2000);
    } catch (err) {
      toast.error("Không thể sao chép vào clipboard");
    }
  };
  
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Công cụ chuyển đổi dữ liệu</h1>
        <p className="text-muted-foreground">
          Chuyển đổi dữ liệu giữa các định dạng khác nhau để chuẩn bị nội dung khóa học.
        </p>
      </div>

      <Tabs defaultValue="text-to-json">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="text-to-json">Văn bản → JSON</TabsTrigger>
          <TabsTrigger value="json-to-text">JSON → Văn bản</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text-to-json">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dữ liệu đầu vào</CardTitle>
            <CardDescription>
              Nhập danh sách các bài học, mỗi bài gồm 2 dòng: tiêu đề và URL video, 
              các bài học cách nhau bởi 1 dòng trống.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Chia sẻ và đọc: Tuổi Ngựa (trang 5, 6)\nhttps://youtu.be/dyGMeWUjV8k\n\nTự đọc sách báo (trang 7)\nhttps://youtu.be/k_r_ooElSk8`}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
          <CardFooter>
            <Button 
              onClick={parseInputText} 
              disabled={isParsing || !inputText.trim()}
              className="w-full"
            >
              {isParsing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                "Phân tích dữ liệu"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Module Creator Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tạo Modules</CardTitle>
            <CardDescription>
              Tạo các module và thêm bài học vào từng module.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={currentModuleTitle}
                onChange={(e) => setCurrentModuleTitle(e.target.value)}
                placeholder="Tên module"
                className="flex-1"
              />
              <Button onClick={addModule} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Thêm module
              </Button>
            </div>
            
            {remainingLessons.length > 0 && (
              <Card className="border-dashed border-green-200 bg-green-50">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm text-green-700 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Bài học tiếp theo
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="font-medium">{remainingLessons[0]?.title}</p>
                  <p className="text-sm text-muted-foreground break-all">{remainingLessons[0]?.videoUrl}</p>
                </CardContent>
                <CardFooter className="border-t pt-2 text-xs text-muted-foreground">
                  Còn lại {remainingLessons.length} bài học
                </CardFooter>
              </Card>
            )}
            
            <div className="space-y-4 mt-4">
              {modules.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="border-blue-100">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-md flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {module.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => addLessonToModule(moduleIndex)}
                        disabled={remainingLessons.length === 0}
                        className="h-8 px-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm bài học
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteModule(moduleIndex)}
                        className="h-8 w-8 p-0 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {module.lessons.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground italic">
                        Chưa có bài học nào
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div 
                            key={lessonIndex} 
                            className="p-2 border rounded-md flex items-start justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground break-all">
                                {lesson.videoUrl}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => removeLessonFromModule(moduleIndex, lessonIndex)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {module.lessons.length} bài học
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
          
          {/* Output JSON Section */}
          <Card>
        <CardHeader>
          <CardTitle>Kết quả JSON</CardTitle>
          <CardDescription>
            Định dạng modules và lessons cho việc nhập liệu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-2">
            <Button onClick={generateOutput} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Tạo JSON
            </Button>
          </div>
          {outputJson && (
            <>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                {outputJson}
              </pre>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={copyToClipboard} 
                  variant="secondary"
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Sao chép JSON
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      </TabsContent>
        
        <TabsContent value="json-to-text">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Dữ liệu JSON đầu vào</CardTitle>
                <CardDescription>
                  Dán dữ liệu JSON với định dạng có mảng lectures. 
                  Lưu ý: và phải là JSON hợp lệ với dấu ngoặc kép cho tất cả key và value string.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs">
                    <p><strong>Hướng dẫn:</strong> Dữ liệu phải là JSON hợp lệ, với:</p>
                    <ul className="list-disc ml-4 mt-1 space-y-1">
                      <li>Phải có dấu mở ngoặc nhọn {'{}'} ở đầu và dấu đóng ngoặc nhọn {'{}'} ở cuối</li>
                      <li>Phải có mảng "lectures" chứa các bài giảng</li>
                      <li>Tất cả các key ("lectures", "title", "videoUrl") phải nằm trong dấu ngoặc kép</li>
                      <li>Tất cả các giá trị string phải nằm trong dấu ngoặc kép</li>
                    </ul>
                  </div>
                  <Textarea
                    value={lecturesJson}
                    onChange={(e) => setLecturesJson(e.target.value)}
                    placeholder={`{
  "lectures": [
    {
      "title": "Unit 1 Lesson 1 (trang 10, 11)",
      "videoUrl": "https://youtu.be/example1"
    },
    {
      "title": "Unit 1 Lesson 2 (trang 12, 13)",
      "videoUrl": "https://youtu.be/example2"
    }
  ]
}`}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={parseLecturesJson} 
                  disabled={isParsingSrc || !lecturesJson.trim()}
                  className="w-full"
                >
                  {isParsingSrc ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      <ArrowDownUp className="mr-2 h-4 w-4" />
                      Chuyển đổi thành văn bản
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Kết quả chuyển đổi</CardTitle>
                <CardDescription>
                  Văn bản đã được làm sạch từ dữ liệu JSON.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cleanedLectures ? (
                  <Textarea 
                    value={cleanedLectures}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Chưa có dữ liệu chuyển đổi.
                  </div>
                )}
              </CardContent>
              {cleanedLectures && (
                <CardFooter>
                  <Button 
                    onClick={copyCleanedText}
                    variant="secondary" 
                    className="w-full"
                  >
                    {copiedClean ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Clipboard className="mr-2 h-4 w-4" />
                        Sao chép văn bản
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
