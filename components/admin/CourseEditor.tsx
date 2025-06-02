"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  memo,
  useMemo,
  useRef,
} from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Trash2,
  BookOpen,
  FileText,
  Video,
  Upload,
  Search,
  TestTube,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { updateCourse } from "@/lib/actions/sanity.actions";
import {
  getTestByLessonId,
  getTests,
  assignTestToLesson,
  unassignTestFromLesson,
} from "@/lib/actions/test.action";

// Define a schema for form validation using zod
const formSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Tên khóa học không được để trống"),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  modules: z.array(
    z.object({
      _key: z.string().optional(),
      title: z.string().min(1, "Tên module không được để trống"),
      lessons: z.array(
        z.object({
          _key: z.string().optional(),
          title: z.string().min(1, "Tên bài học không được để trống"),
          description: z.string().optional(),
          isPreview: z.boolean().default(false), // Set default to false to ensure it's always a boolean
          videoUrl: z.string().optional(),
          testId: z.number().optional(),
          testName: z.string().optional(),
        })
      ),
    })
  ),
});

// Define type based on the schema
type FormValues = z.infer<typeof formSchema>;
type TFieldValues = z.infer<typeof formSchema>;

// Test interface
interface Test {
  id: number;
  name: string;
  subject?: {
    id: number;
    name: string;
  };
  grade?: {
    id: number;
    name: string;
  };
}

interface CourseEditorProps {
  course: any;
}

// Define interfaces for props to improve type safety
interface ModuleProps {
  module: any;
  moduleIndex: number;
  form: any;
  removeModule: (index: number) => void;
  addLesson: (moduleIndex: number) => void;
  openTestDialog: (moduleIndex: number, lessonIndex: number) => void;
  removeLesson: (moduleIndex: number, lessonIndex: number) => void;
  removeTest: (moduleIndex: number, lessonIndex: number) => void;
}

interface ModuleListProps {
  modules: any[];
  form: any;
  removeModule: (index: number) => void;
  addLesson: (moduleIndex: number) => void;
  openTestDialog: (moduleIndex: number, lessonIndex: number) => void;
  removeLesson: (moduleIndex: number, lessonIndex: number) => void;
  removeTest: (moduleIndex: number, lessonIndex: number) => void;
  insertModuleAt: (index: number) => void;
}

// Memoized ModuleList component with proper TypeScript typing
const ModuleList = memo(function ModuleList({
  modules,
  form,
  removeModule,
  addLesson,
  removeLesson,
  openTestDialog,
  removeTest,
  insertModuleAt,
}: ModuleListProps) {
  return (
    <>
      {modules.map((module, moduleIndex) => (
        <div key={module._key || `module-${moduleIndex}`} className="mb-6">
          <Module
            module={module}
            moduleIndex={moduleIndex}
            form={form}
            removeModule={removeModule}
            addLesson={addLesson}
            openTestDialog={openTestDialog}
            removeLesson={removeLesson}
            removeTest={removeTest}
          />
          {/* Insert module button after this module */}
          <div className="my-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertModuleAt(moduleIndex + 1)}
              className="flex items-center gap-1 w-full justify-center border-dashed"
            >
              <Plus className="h-4 w-4" /> Thêm module ở đây
            </Button>
          </div>
        </div>
      ))}
    </>
  );
});

// Memoized Module component to prevent unnecessary re-renders
const Module = memo(
  ({
    module,
    moduleIndex,
    form,
    removeModule,
    addLesson,
    removeLesson,
    openTestDialog,
    removeTest,
  }: ModuleProps) => {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <FormField
              control={form.control}
              name={`modules.${moduleIndex}.title`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Tên module"
                      className="text-lg font-semibold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeModule(moduleIndex)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {module.lessons.map((lesson: any, lessonIndex: number) => (
              <Lesson
                key={lesson._key || `lesson-${lessonIndex}`}
                lesson={lesson}
                moduleIndex={moduleIndex}
                lessonIndex={lessonIndex}
                form={form}
                removeLesson={removeLesson}
                openTestDialog={openTestDialog}
                removeTest={removeTest}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addLesson(moduleIndex)}
              className="w-full mt-2 flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" /> Thêm bài học
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

// Memoized Lesson component to prevent unnecessary re-renders
const Lesson = memo(
  ({
    lesson,
    moduleIndex,
    lessonIndex,
    form,
    removeLesson,
    openTestDialog,
    removeTest,
  }: {
    lesson: any;
    moduleIndex: number;
    lessonIndex: number;
    form: any;
    removeLesson: (moduleIndex: number, lessonIndex: number) => void;
    openTestDialog: (moduleIndex: number, lessonIndex: number) => void;
    removeTest: (moduleIndex: number, lessonIndex: number) => void;
  }) => {
    return (
      <Card>
        <CardHeader className="py-3">
          <div className="flex justify-between items-start">
            <FormField
              control={form.control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Tên bài học"
                      className="font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeLesson(moduleIndex, lessonIndex)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-0 space-y-4">
          <FormField
            control={form.control}
            name={`modules.${moduleIndex}.lessons.${lessonIndex}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Mô tả bài học
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả chi tiết bài học"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`modules.${moduleIndex}.lessons.${lessonIndex}.videoUrl`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Video className="h-4 w-4" /> URL Video
                </FormLabel>
                <FormControl>
                  <Input placeholder="URL video bài học (nếu có)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`modules.${moduleIndex}.lessons.${lessonIndex}.isPreview`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Cho phép xem trước</FormLabel>
                  <FormDescription>
                    Học viên có thể xem bài học này mà không cần đăng ký khóa
                    học
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Test integration section */}
          <div className="border p-3 rounded-md bg-gray-50 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium flex items-center gap-1">
                <TestTube className="h-4 w-4" /> Bài kiểm tra
              </h4>
              <div className="flex items-center gap-2">
                {form.watch(
                  `modules.${moduleIndex}.lessons.${lessonIndex}.testId`
                ) && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTest(moduleIndex, lessonIndex)}
                    className="h-7 px-2 text-xs"
                  >
                    Xóa
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openTestDialog(moduleIndex, lessonIndex)}
                  className="h-7 px-2 text-xs"
                >
                  {form.watch(
                    `modules.${moduleIndex}.lessons.${lessonIndex}.testId`
                  )
                    ? "Thay đổi"
                    : "Thêm bài kiểm tra"}
                </Button>
              </div>
            </div>
            {form.watch(
              `modules.${moduleIndex}.lessons.${lessonIndex}.testId`
            ) ? (
              <div className="p-2 bg-white border rounded-md">
                <p className="text-sm font-medium">
                  {form.watch(
                    `modules.${moduleIndex}.lessons.${lessonIndex}.testName`
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID:{" "}
                  {form.watch(
                    `modules.${moduleIndex}.lessons.${lessonIndex}.testId`
                  )}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Chưa có bài kiểm tra nào được gán
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

// TestSearchDialog component definition
interface TestSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testSearchValue: string;
  setTestSearchValue: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: React.SetStateAction<number>) => void;
  totalPages: number;
  selectedSubject: number | null;
  setSelectedSubject: (value: number | null) => void;
  selectedGrade: number | null;
  setSelectedGrade: (value: number | null) => void;
  subjects: { id: number; name: string }[];
  grades: { id: number; name: string }[];
  isSearching: boolean;
  searchResults: Test[];
  assignTest: (test: Test) => void;
}

const TestSearchDialog = ({
  open,
  onOpenChange,
  testSearchValue,
  setTestSearchValue,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedSubject,
  setSelectedSubject,
  selectedGrade,
  setSelectedGrade,
  subjects,
  grades,
  isSearching,
  searchResults,
  assignTest,
}: TestSearchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tìm và chọn bài kiểm tra</DialogTitle>
          <DialogDescription>
            Tìm kiếm bài kiểm tra để gán vào bài học
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {/* Simplified search input */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Nhập tên bài kiểm tra"
              value={testSearchValue}
              onChange={(e) => {
                setTestSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-grow"
            />
            {isSearching && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>

          {/* Minimalist filter controls in a row */}
          <div className="flex gap-2 flex-wrap">
            <Select
              value={selectedSubject?.toString() || "all"}
              onValueChange={(value) => {
                setSelectedSubject(value === "all" ? null : Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 text-xs flex-1 min-w-[120px]">
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn học</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedGrade?.toString() || "all"}
              onValueChange={(value) => {
                setSelectedGrade(value === "all" ? null : Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 text-xs flex-1 min-w-[120px]">
                <SelectValue placeholder="Lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id.toString()}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ultra-minimalist results list */}
          <div className="h-[200px] overflow-y-auto border rounded-md">
            {isSearching ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-center text-xs text-muted-foreground">
                  {testSearchValue || selectedSubject || selectedGrade
                    ? "Không tìm thấy kết quả"
                    : "Nhập từ khóa để tìm kiếm"}
                </p>
              </div>
            ) : (
              <div>
                {/* No spacing between items for better performance */}
                {searchResults.map((test) => (
                  <div
                    key={test.id}
                    className="py-1 px-2 hover:bg-muted cursor-pointer border-b text-xs"
                    onClick={() => assignTest(test)}
                  >
                    <div className="font-medium">{test.name}</div>
                    <div className="text-muted-foreground text-[10px] flex gap-2">
                      {test.subject?.name && <span>{test.subject.name}</span>}
                      {test.grade?.name && <span>{test.grade.name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simple pagination */}
          {!isSearching && searchResults.length > 0 && (
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-xs">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Use React.memo to prevent unnecessary re-renders
const MemoizedTestSearchDialog = memo(TestSearchDialog);

export type { Test };

export default function CourseEditor({ course }: CourseEditorProps): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testSearchValue, setTestSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Test[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [grades, setGrades] = useState<{ id: number; name: string }[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);

  // Initialize form with existing course data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any, // Type assertion to avoid resolver incompatibility
    defaultValues: {
      _id: course?._id || "",
      title: course?.title || "",
      description: course?.description || "",
      price: course?.price || 0,
      categoryId: course?.category?._ref || "",
      authorId: course?.author?._ref || "",
      tags: course?.tags || [],
      modules:
        course?.modules?.map((module: any) => ({
          _key: module._key,
          title: module.title,
          lessons:
            module.lessons?.map((lesson: any) => ({
              _key: lesson._key,
              title: lesson.title,
              description: lesson.description || "",
              isPreview:
                typeof lesson.isPreview === "boolean"
                  ? lesson.isPreview
                  : false, // Ensure it's always a boolean
              videoUrl: lesson.videoUrl || "",
              testId: lesson.testId || undefined,
              testName: lesson.testName || undefined,
            })) || [],
        })) || [],
    },
  });

  // Fetch assigned tests for each lesson when component mounts
  // Using a more optimized approach with Promise.all to reduce sequential API calls
  useEffect(() => {
    const fetchAssignedTests = async () => {
      try {
        const modules = form.getValues("modules");
        const updatedModules = [...modules];
        let hasChanges = false;

        // Collect all lessons with keys for parallel fetching
        const lessonsToFetch = [];

        for (let i = 0; i < modules.length; i++) {
          const module = modules[i];
          for (let j = 0; j < module.lessons.length; j++) {
            const lesson = module.lessons[j];
            if (lesson._key) {
              lessonsToFetch.push({
                moduleIndex: i,
                lessonIndex: j,
                lessonKey: lesson._key,
              });
            }
          }
        }

        // Fetch all test data in parallel with batching
        // Process in batches of 5 to avoid overwhelming the server
        const batchSize = 5;
        for (let i = 0; i < lessonsToFetch.length; i += batchSize) {
          const batch = lessonsToFetch.slice(i, i + batchSize);
          const results = await Promise.all(
            batch.map((item) => getTestByLessonId(item.lessonKey))
          );

          // Process batch results
          results.forEach((response, index) => {
            const { moduleIndex, lessonIndex } = batch[index];
            // Type assertion to safely access response data
            const testData = response as any;
            if (testData && testData.test) {
              updatedModules[moduleIndex].lessons[lessonIndex] = {
                ...updatedModules[moduleIndex].lessons[lessonIndex],
                testId: testData.test.id,
                testName: testData.test.name,
              };
              hasChanges = true;
            }
          });
        }

        if (hasChanges) {
          form.setValue("modules", updatedModules);
        }
      } catch (error) {
        console.error("Error fetching assigned tests:", error);
        toast.error("Lỗi khi tải thông tin bài kiểm tra");
      }
    };

    fetchAssignedTests();
  }, []);

  // Handle form submission
  const onSubmit = async (values: TFieldValues) => {
    try {
      setIsLoading(true);

      // Call the updateCourse action with the form values
      const result = await updateCourse(values);

      if (result.success) {
        toast.success("Cập nhật khóa học thành công");
        router.push("/admin/courses");
        router.refresh();
      } else {
        toast.error(result.message || "Cập nhật khóa học thất bại");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Cập nhật khóa học thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new module to the end of the form
  const addModule = () => {
    const currentModules = form.getValues("modules");
    form.setValue("modules", [
      ...currentModules,
      {
        _key: `module_${Date.now()}`,
        title: `Module ${currentModules.length + 1}`,
        lessons: [
          {
            _key: `lesson_${Date.now()}`,
            title: "",
            description: "",
            isPreview: false,
            videoUrl: "",
          },
        ],
      },
    ]);
    toast.success("Đã thêm module mới");
  };

  // Insert a new module at a specific position
  const insertModuleAt = (index: number) => {
    const currentModules = form.getValues("modules");
    const newModules = [...currentModules];

    // Create a new module with a unique key
    const newModule = {
      _key: `module_${Date.now()}`,
      title: `Module ${index + 1}`,
      lessons: [
        {
          _key: `lesson_${Date.now()}`,
          title: "Bài học mới",
          description: "",
          isPreview: false,
          videoUrl: "",
        },
      ],
    };

    // Insert the new module at the specified index
    newModules.splice(index, 0, newModule);

    // Update module titles to maintain order if needed
    const updatedModules = newModules.map((module, i) => ({
      ...module,
      title: module.title.startsWith("Module ")
        ? `Module ${i + 1}`
        : module.title,
    }));

    form.setValue("modules", updatedModules);
    toast.success("Đã thêm module mới");
  };

  // Remove a module from the form
  const removeModule = (index: number) => {
    const currentModules = form.getValues("modules");
    const updatedModules = [...currentModules];
    updatedModules.splice(index, 1);
    form.setValue("modules", updatedModules);
    toast.success("Đã xóa module");
  };

  // Add a new lesson to a module
  const addLesson = (moduleIndex: number) => {
    const currentModules = form.getValues("modules");
    const updatedModules = [...currentModules];
    const currentLessons = updatedModules[moduleIndex].lessons;

    updatedModules[moduleIndex].lessons = [
      ...currentLessons,
      {
        _key: `lesson_${Date.now()}`,
        title: "",
        description: "",
        isPreview: false,
        videoUrl: "",
      },
    ];

    form.setValue("modules", updatedModules);
    toast.success("Đã thêm bài học mới");
  };

  // Remove a lesson from a module
  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const currentModules = form.getValues("modules");

    // Don't allow removing the last lesson in a module
    if (currentModules[moduleIndex].lessons.length <= 1) {
      toast.error("Module phải có ít nhất một bài học");
      return;
    }

    const updatedModules = [...currentModules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    form.setValue("modules", updatedModules);
    toast.success("Đã xóa bài học");
  };

  // Hardcoded filter values to prevent expensive API calls
  // This is a temporary performance optimization - in production you would want a lightweight API
  const STATIC_SUBJECTS = [
    { id: 1, name: "Toán học" },
    { id: 2, name: "Vật lý" },
    { id: 3, name: "Hóa học" },
    { id: 4, name: "Sinh học" },
    { id: 5, name: "Ngữ văn" },
    { id: 6, name: "Lịch sử" },
    { id: 7, name: "Địa lý" },
    { id: 8, name: "Tiếng Anh" },
  ];

  const STATIC_GRADES = [
    { id: 1, name: "Lớp 1" },
    { id: 2, name: "Lớp 2" },
    { id: 3, name: "Lớp 3" },
    { id: 4, name: "Lớp 4" },
    { id: 5, name: "Lớp 5" },
    { id: 6, name: "Lớp 6" },
    { id: 7, name: "Lớp 7" },
    { id: 8, name: "Lớp 8" },
    { id: 9, name: "Lớp 9" },
    { id: 10, name: "Lớp 10" },
    { id: 11, name: "Lớp 11" },
    { id: 12, name: "Lớp 12" },
  ];

  // Load static filters only once when dialog opens
  useEffect(() => {
    if (testDialogOpen && subjects.length === 0) {
      // Use static data instead of API call
      setSubjects(STATIC_SUBJECTS);
      setGrades(STATIC_GRADES);
    }
  }, [testDialogOpen, subjects.length]);

  // Reference to track current search request
  const searchRequestRef = useRef<number>(0);

  // Optimized search function with increased debounce and request cancellation
  const debouncedSearch = useCallback(
    debounce(
      async (
        value: string,
        page: number,
        subjectId?: number | null,
        gradeId?: number | null
      ) => {
        // Skip unnecessary searches - only search with meaningful filters
        if (!value.trim() && !subjectId && !gradeId) {
          setSearchResults([]);
          setTotalPages(1);
          setIsSearching(false);
          return;
        }

        // Increment request ID to track the latest request
        const currentRequestId = ++searchRequestRef.current;
        setIsSearching(true);

        try {
          // Only fetch minimal data with strict limits
          const response = await getTests({
            search: value.trim(),
            page,
            limit: 3, // Drastically reduce to only 3 results per page for much faster loading
            subjectId: subjectId || undefined,
            gradeId: gradeId || undefined,
            // Note: 'fields' parameter removed as it's not in the TypeScript type definition
          });

          // Ignore results from outdated requests
          if (currentRequestId !== searchRequestRef.current) return;

          if (response && response.tests) {
            setSearchResults(response.tests);
            setTotalPages(response.pagination?.totalPages || 1);
          } else {
            setSearchResults([]);
            setTotalPages(1);
          }
        } catch (error) {
          // Only show error for the latest request
          if (currentRequestId === searchRequestRef.current) {
            console.error("Error searching tests:", error);
            // Don't show error toast for better UX - just clear results
            setSearchResults([]);
            setTotalPages(1);
          }
        } finally {
          // Only update loading state for the latest request
          if (currentRequestId === searchRequestRef.current) {
            setIsSearching(false);
          }
        }
      },
      500
    ), // Increased to 500ms for better performance
    []
  );

  // Optimized effect to trigger search only when needed
  useEffect(() => {
    // Clear search results when dialog closes
    if (!testDialogOpen) {
      setSearchResults([]);
      return;
    }

    // Only perform search when we have meaningful search criteria
    const hasSearchCriteria =
      testSearchValue.trim().length > 0 ||
      selectedSubject !== null ||
      selectedGrade !== null;

    if (testDialogOpen && hasSearchCriteria) {
      debouncedSearch(
        testSearchValue,
        currentPage,
        selectedSubject,
        selectedGrade
      );
    }
  }, [
    testSearchValue,
    testDialogOpen,
    debouncedSearch,
    currentPage,
    selectedSubject,
    selectedGrade,
  ]);

  // Open test dialog for a specific lesson
  const openTestDialog = (moduleIndex: number, lessonIndex: number) => {
    setCurrentLessonIndex({ moduleIndex, lessonIndex });
    setTestSearchValue("");
    setSearchResults([]);
    setCurrentPage(1);
    setSelectedSubject(null);
    setSelectedGrade(null);
    setTestDialogOpen(true);
  };

  // Assign test to lesson
  const assignTest = async (test: Test) => {
    if (!currentLessonIndex) return;

    const { moduleIndex, lessonIndex } = currentLessonIndex;
    const currentModules = form.getValues("modules");
    const lesson = currentModules[moduleIndex].lessons[lessonIndex];

    try {
      // Assign test in MongoDB
      if (lesson._key) {
        await assignTestToLesson({
          lessonId: lesson._key,
          testId: test.id,
        });
      }

      // Update form state
      const updatedModules = [...currentModules];
      updatedModules[moduleIndex].lessons[lessonIndex] = {
        ...lesson,
        testId: test.id,
        testName: test.name,
      };

      form.setValue("modules", updatedModules);
      setTestDialogOpen(false);
      setCurrentLessonIndex(null);
      toast.success("Đã gán bài kiểm tra cho bài học");
    } catch (error) {
      console.error("Error assigning test to lesson:", error);
      toast.error("Lỗi khi gán bài kiểm tra cho bài học");
    }
  };

  // Remove test from lesson
  const removeTest = async (moduleIndex: number, lessonIndex: number) => {
    const currentModules = form.getValues("modules");
    const lesson = currentModules[moduleIndex].lessons[lessonIndex];

    try {
      // Remove test assignment in MongoDB
      if (lesson._key) {
        await unassignTestFromLesson(lesson._key);
      }

      // Update form state
      const updatedModules = [...currentModules];
      updatedModules[moduleIndex].lessons[lessonIndex] = {
        ...lesson,
        testId: undefined,
        testName: undefined,
      };

      form.setValue("modules", updatedModules);
      toast.success("Đã xóa bài kiểm tra khỏi bài học");
    } catch (error) {
      console.error("Error removing test:", error);
      toast.error("Không thể xóa bài kiểm tra khỏi bài học");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold">Thông tin khóa học</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden field for slug - We'll generate it from title */}
            <input type="hidden" {...form.register("_id")} />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden fields for course metadata - not shown in UI */}
          <input type="hidden" {...form.register("categoryId")} />
          <input type="hidden" {...form.register("authorId")} />
          <input type="hidden" {...form.register("tags")} />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Modules & Bài học</h2>
              <Button
                type="button"
                onClick={addModule}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Thêm module
              </Button>
            </div>

            {/* Insert module button at the beginning */}
            <div className="mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertModuleAt(0)}
                className="flex items-center gap-1 w-full justify-center border-dashed"
              >
                <Plus className="h-4 w-4" /> Thêm module ở đây
              </Button>
            </div>

            {/* Virtualized Module List - Only render visible modules */}
            <ModuleList
              modules={form.watch("modules")}
              form={form}
              removeModule={removeModule}
              addLesson={addLesson}
              openTestDialog={openTestDialog}
              removeLesson={removeLesson}
              removeTest={removeTest}
              insertModuleAt={insertModuleAt}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/courses")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </form>

      {/* Memoized Test Search Dialog to prevent re-renders */}
      <MemoizedTestSearchDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
        testSearchValue={testSearchValue}
        setTestSearchValue={setTestSearchValue}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        subjects={subjects}
        grades={grades}
        isSearching={isSearching}
        searchResults={searchResults}
        assignTest={assignTest}
      />
    </Form>
  );
}
