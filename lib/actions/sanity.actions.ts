"use server";

import { revalidatePath } from "next/cache";
import { adminClient } from "@/sanity/lib/adminClient";
import { client } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

// Define types for the form data
interface LessonData {
  title: string;
  description?: string;
  isPreview: boolean;
  videoUrl?: string;
}

interface ModuleData {
  title: string;
  lessons: LessonData[];
}

interface CourseData {
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
