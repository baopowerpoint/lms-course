"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, BookOpen, FileText, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { createCourse } from "@/lib/actions/sanity.actions";

// Define schemas for form validation
const lessonSchema = z.object({
  title: z.string().min(1, "Tiêu đề bài học là bắt buộc"),
  description: z.string().optional(),
  isPreview: z.boolean().default(false),
  videoUrl: z.string().url("URL video không hợp lệ").optional().or(z.literal('')),
});

const moduleSchema = z.object({
  title: z.string().min(1, "Tiêu đề module là bắt buộc"),
  lessons: z.array(lessonSchema).min(1, "Cần ít nhất một bài học"),
});

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề khóa học là bắt buộc"),
  description: z.string().min(1, "Mô tả khóa học là bắt buộc"),
  price: z.number().min(0, "Giá không được âm"),
  categoryId: z.string().min(1, "Danh mục là bắt buộc"),
  authorId: z.string().min(1, "Giảng viên là bắt buộc"),
  tags: z.string().optional(),
  modules: z.array(moduleSchema).min(1, "Cần ít nhất một module"),
});

type FormValues = z.infer<typeof formSchema>;
type TFieldValues = FormValues;

export default function CourseCreator() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  
  // Initialize the form
  const form = useForm<TFieldValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      categoryId: "",
      authorId: "",
      tags: "",
      modules: [
        {
          title: "Module 1",
          lessons: [{ title: "", description: "", isPreview: false, videoUrl: "" }],
        },
      ],
    },
  });

  // Fetch categories and authors from Sanity when component mounts
  useState(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and authors in parallel
        const [categoriesResult, authorsResult] = await Promise.all([
          fetch('/api/sanity/categories'),
          fetch('/api/sanity/authors')
        ]);
        
        if (!categoriesResult.ok) throw new Error('Không thể tải danh mục');
        if (!authorsResult.ok) throw new Error('Không thể tải giảng viên');
        
        const categoriesData = await categoriesResult.json();
        const authorsData = await authorsResult.json();
        
        if (categoriesData.success) setCategories(categoriesData.data);
        if (authorsData.success) setAuthors(authorsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải danh mục và giảng viên");
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const onSubmit = async (values: TFieldValues) => {
    setIsLoading(true);
    
    try {
      // Process tags from comma-separated string to array
      const tagsArray = values.tags ? values.tags.split(",").map(tag => tag.trim()) : [];
      
      // Prepare the course data
      const courseData = {
        ...values,
        tags: tagsArray,
      };
      
      // Send data to server action
      const result = await createCourse(courseData);
      
      if (result.success) {
        toast.success("Khóa học đã được tạo thành công!");
        router.push("/admin/courses");
      } else {
        toast.error(result.error || "Không thể tạo khóa học");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Đã xảy ra lỗi khi tạo khóa học");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new module to the form
  const addModule = () => {
    const currentModules = form.getValues("modules");
    form.setValue("modules", [
      ...currentModules,
      {
        title: `Module ${currentModules.length + 1}`,
        lessons: [{ title: "", description: "", isPreview: false, videoUrl: "" }],
      },
    ]);
  };

  // Remove a module from the form
  const removeModule = (index: number) => {
    const currentModules = form.getValues("modules");
    if (currentModules.length === 1) {
      toast.error("Cần ít nhất một module");
      return;
    }
    form.setValue(
      "modules",
      currentModules.filter((_, i) => i !== index)
    );
  };

  // Add a new lesson to a module
  const addLesson = (moduleIndex: number) => {
    const currentModules = form.getValues("modules");
    const currentLessons = currentModules[moduleIndex].lessons;

    const updatedModules = [...currentModules];
    updatedModules[moduleIndex] = {
      ...currentModules[moduleIndex],
      lessons: [
        ...currentLessons,
        { title: "", description: "", isPreview: false, videoUrl: "" },
      ],
    };

    form.setValue("modules", updatedModules);
  };

  // Remove a lesson from a module
  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const currentModules = form.getValues("modules");
    const currentLessons = currentModules[moduleIndex].lessons;

    if (currentLessons.length === 1) {
      toast.error("Cần ít nhất một bài học trong module");
      return;
    }

    const updatedLessons = currentLessons.filter((_, i) => i !== lessonIndex);
    const updatedModules = [...currentModules];
    updatedModules[moduleIndex] = {
      ...currentModules[moduleIndex],
      lessons: updatedLessons,
    };

    form.setValue("modules", updatedModules);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khóa học</CardTitle>
            <CardDescription>Nhập các thông tin cơ bản cho khóa học</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên khóa học" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn gọn về khóa học"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="authorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giảng viên</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giảng viên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author._id} value={author._id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Toán học, Đại số, Phương trình,..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Phân cách các tags bằng dấu phẩy (,)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Modules và Bài học</h2>
            <Button
              type="button"
              onClick={addModule}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm module
            </Button>
          </div>

          {form.watch("modules").map((module, moduleIndex) => (
            <Card key={moduleIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Module {moduleIndex + 1}
                  </CardTitle>
                </div>
                {moduleIndex > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500"
                    onClick={() => removeModule(moduleIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa module</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`modules.${moduleIndex}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên module</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên module" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Bài học</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => addLesson(moduleIndex)}
                    >
                      <Plus className="h-3 w-3" />
                      Thêm bài học
                    </Button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <Card key={lessonIndex} className="border-dashed">
                      <CardHeader className="flex flex-row items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <p className="font-medium text-sm">
                            Bài {lessonIndex + 1}
                          </p>
                        </div>
                        {lessonIndex > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500"
                            onClick={() =>
                              removeLesson(moduleIndex, lessonIndex)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Xóa bài học</span>
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="py-2 space-y-4">
                        <FormField
                          control={form.control}
                          name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên bài học</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tên bài học"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`modules.${moduleIndex}.lessons.${lessonIndex}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô tả</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Mô tả ngắn gọn về bài học"
                                  className="resize-none h-16"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`modules.${moduleIndex}.lessons.${lessonIndex}.videoUrl`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1">
                                  <Video className="h-3 w-3" />
                                  Video URL
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com/video.mp4"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`modules.${moduleIndex}.lessons.${lessonIndex}.isPreview`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Bài học miễn phí</FormLabel>
                                  <FormDescription>
                                    Người dùng có thể xem ngay cả khi chưa mua khóa học
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo khóa học...
            </>
          ) : (
            <>Tạo khóa học</>
          )}
        </Button>
      </form>
    </Form>
  );
}
