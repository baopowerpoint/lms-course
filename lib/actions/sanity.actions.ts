"use server";

import { revalidatePath } from "next/cache";
import { adminClient } from "@/sanity/lib/adminClient";
import { client } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

// Define types for the form data
interface LessonData {
  _key?: string;
  title: string;
  description?: string;
  isPreview: boolean;
  videoUrl?: string;
  testId?: number;
  testName?: string;
}

interface ModuleData {
  _key?: string;
  title: string;
  lessons: LessonData[];
}

interface CourseData {
  _id?: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  authorId: string;
  tags: string[];
  modules: ModuleData[];
}

// Create a course, modules, and lessons in Sanity in a single transaction
export async function createCourse(data: CourseData) {
  try {
    // Generate a slug from the title
    const slug = `${slugify(data.title, {
      lower: true,
      trim: true,
      locale: "vi",
    })}-${uuidv4().slice(0, 4)}`;

    // Start a transaction
    const transaction = adminClient.transaction();

    // Array to store created lesson references
    const moduleRefs: { _key: string; _ref: string; _type: string }[] = [];

    // Create each module and its lessons
    for (const moduleData of data.modules) {
      const moduleId = `module-${uuidv4()}`;
      const lessonRefs: { _key: string; _ref: string; _type: string }[] = [];

      // Create each lesson for this module
      for (const lessonData of moduleData.lessons) {
        const lessonId = `lesson-${uuidv4()}`;
        const lessonKey = uuidv4();

        // Create lesson document
        transaction.create({
          _id: lessonId,
          _type: "lesson",
          title: lessonData.title,
          description: lessonData.description || "",
          isPreview: lessonData.isPreview || false,
          slug: {
            _type: "slug",
            current: `${slugify(lessonData.title, {
              lower: true,
              trim: true,
              locale: "vi",
            })}-${uuidv4().slice(0, 4)}`,
          },
          lessonType: "video",
          videoUrl: lessonData.videoUrl || "",
        });

        // Add reference to this lesson
        lessonRefs.push({
          _key: lessonKey,
          _ref: lessonId,
          _type: "reference",
        });
      }

      // Create module document
      transaction.create({
        _id: moduleId,
        _type: "module",
        title: moduleData.title,
        slug: {
          _type: "slug",
          current: `${slug}-${slugify(moduleData.title, {
            lower: true,
            trim: true,
            locale: "vi",
          })}-${uuidv4().slice(0, 4)}`,
        },
        lessons: lessonRefs,
      });

      // Add reference to this module
      const moduleKey = uuidv4();
      moduleRefs.push({
        _key: moduleKey,
        _ref: moduleId,
        _type: "reference",
      });
    }

    // Create course document
    const courseId = `course-${uuidv4()}`;
    transaction.create({
      _id: courseId,
      _type: "course",
      title: data.title,
      description: data.description,
      price: data.price,
      slug: {
        _type: "slug",
        current: slug,
      },
      category: {
        _type: "reference",
        _ref: data.categoryId,
      },
      author: {
        _type: "reference",
        _ref: data.authorId,
      },
      tags: data.tags,
      modules: moduleRefs,
    });

    // Commit the transaction
    await transaction.commit();

    // Revalidate the course pages
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return { success: true, courseId };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Lỗi khi tạo khóa học" };
  }
}

// Function to fetch categories from Sanity
export async function getCategories() {
  try {
    const categories = await client.fetch(`*[_type == "category"]{
      _id,
      name
    }`);

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Lỗi khi tải danh mục" };
  }
}

// Function to fetch authors from Sanity
export async function getAuthors() {
  try {
    const authors = await client.fetch(`*[_type == "author"]{
      _id,
      name
    }`);

    return { success: true, data: authors };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return { success: false, error: "Lỗi khi tải danh sách giảng viên" };
  }
}

// Update an existing course, modules, and lessons in Sanity
export async function updateCourse(data: CourseData) {
  try {
    if (!data._id) {
      throw new Error("Course ID is required for updating");
    }
    
    // Start a transaction
    const transaction = adminClient.transaction();
    
    // Update the course document
    transaction.patch(data._id, {
      set: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: {
          _type: "reference",
          _ref: data.categoryId,
        },
        author: {
          _type: "reference",
          _ref: data.authorId,
        },
        tags: data.tags,
      },
    });
    
    // Fetch existing modules to compare with updated data
    const existingCourse = await client.fetch(
      `*[_type == "course" && _id == $courseId][0]{
        modules[]->{
          _id,
          _key,
          title,
          lessons[]->{
            _id,
            _key,
            title,
            description,
            isPreview,
            videoUrl
          }
        }
      }`,
      { courseId: data._id }
    );
    
    // Create map of existing modules and lessons for quick lookup
    const existingModules = new Map();
    if (existingCourse && existingCourse.modules) {
      existingCourse.modules.forEach((module: any) => {
        existingModules.set(module._key, {
          ...module,
          lessons: new Map(
            module.lessons.map((lesson: any) => [lesson._key, lesson])
          ),
        });
      });
    }
    
    // Process each module
    const moduleRefs: { _key: string; _ref: string; _type: string }[] = [];
    
    for (const moduleData of data.modules) {
      // Check if this is an existing module or a new one
      const isExistingModule = moduleData._key && existingModules.has(moduleData._key);
      const moduleId = isExistingModule 
        ? existingModules.get(moduleData._key)._id 
        : `module-${uuidv4()}`;
      const moduleKey = moduleData._key || uuidv4();
      
      // Process lessons for this module
      const lessonRefs: { _key: string; _ref: string; _type: string }[] = [];
      
      for (const lessonData of moduleData.lessons) {
        // Check if this is an existing lesson or a new one
        const isExistingLesson = isExistingModule && lessonData._key && 
          existingModules.get(moduleData._key).lessons.has(lessonData._key);
        
        const lessonId = isExistingLesson 
          ? existingModules.get(moduleData._key).lessons.get(lessonData._key)._id 
          : `lesson-${uuidv4()}`;
        const lessonKey = lessonData._key || uuidv4();
        
        if (isExistingLesson) {
          // Update existing lesson
          transaction.patch(lessonId, {
            set: {
              title: lessonData.title,
              description: lessonData.description || "",
              isPreview: lessonData.isPreview || false,
              lessonType: "video",
              videoUrl: lessonData.videoUrl || "",
            },
          });
        } else {
          // Create new lesson
          transaction.create({
            _id: lessonId,
            _type: "lesson",
            title: lessonData.title,
            description: lessonData.description || "",
            isPreview: lessonData.isPreview || false,
            slug: {
              _type: "slug",
              current: `${slugify(lessonData.title, {
                lower: true,
                trim: true,
                locale: "vi",
              })}-${uuidv4().slice(0, 4)}`,
            },
            lessonType: "video",
            videoUrl: lessonData.videoUrl || "",
          });
        }
        
        // Add reference to this lesson
        lessonRefs.push({
          _key: lessonKey,
          _ref: lessonId,
          _type: "reference",
        });
      }
      
      if (isExistingModule) {
        // Update existing module
        transaction.patch(moduleId, {
          set: {
            title: moduleData.title,
            lessons: lessonRefs,
          },
        });
      } else {
        // Generate slug for new module
        const courseSlug = data.title ? slugify(data.title, {
          lower: true,
          trim: true,
          locale: "vi",
        }) : "course";
        
        // Create new module
        transaction.create({
          _id: moduleId,
          _type: "module",
          title: moduleData.title,
          slug: {
            _type: "slug",
            current: `${courseSlug}-${slugify(moduleData.title, {
              lower: true,
              trim: true,
              locale: "vi",
            })}-${uuidv4().slice(0, 4)}`,
          },
          lessons: lessonRefs,
        });
      }
      
      // Add reference to this module
      moduleRefs.push({
        _key: moduleKey,
        _ref: moduleId,
        _type: "reference",
      });
    }
    
    // Update course modules
    transaction.patch(data._id as string, {
      set: {
        modules: moduleRefs,
      },
    });
    
    // Commit the transaction
    await transaction.commit();
    
    // Revalidate the course pages
    revalidatePath(`/courses`);
    revalidatePath(`/admin/courses`);
    revalidatePath(`/admin/course-creator/${data._id}/edit`);
    
    return { success: true, courseId: data._id };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Lỗi khi cập nhật khóa học" };
  }
}
