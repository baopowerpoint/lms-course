"use server";

import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { cache } from "react";

export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  video?: any;
  duration?: number;
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  lessons?: Lesson[];
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: any;
  category: {
    name: string;
  };
  author: {
    name: string;
    image: any;
    bio?: string;
  };
  tags: string[];
  modules?: Module[];
}

export const getCourseById = cache(
  async (id: string): Promise<Course | null> => {
    if (!id) return null;

    try {
      const course = await client.fetch(
        groq`*[_type == "course" && _id == $id][0]{
        _id,
        title,
        slug,
        description,
        price,
        image,
        category->{name},
        author->{name, picture},
        modules[]->{_id, title, description, lessons[]->{_id, title, description, videoUrl, duration}}
      }
    `,
        { id }
      );

      if (!course) return null;

      return {
        ...course,
        image: course.image ? urlFor(course.image).url() : null,
        author: {
          ...course.author,
          picture: course.author?.picture
            ? urlFor(course.author.picture).url()
            : null,
        },
      };
    } catch (error) {
      console.error("Error fetching course by ID:", error);
      return null;
    }
  }
);

export const getCourseBySlug = cache(
  async (slug: string): Promise<Course | null> => {
    if (!slug) return null;

    try {
      const query = groq`
      *[_type == "course" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        description,
        price,
        image,
        "category": category->{ name },
        "author": author->{
          name,
          image,
          "bio": description
        },
        tags,
        "modules": modules[]->{
          _id,
          title,
          description,
          "lessons": lessons[]->{
            _id,
            title,
            description,
            videoUrl,
            duration
          }
        }
      }
    `;

      const course = await client.fetch(query, { slug });

      if (!course) return null;

      return {
        ...course,
        image: course.image ? urlFor(course.image).url() : null,
        author: course.author
          ? {
              ...course.author,
              image: course.author.image
                ? urlFor(course.author.image).url()
                : null,
            }
          : null,
      };
    } catch (error) {
      console.error("Error fetching course by slug:", error);
      return null;
    }
  }
);

export async function getCourses(params?: {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<Course[]> {
  const { query = "", category = "", page = 1, limit = 8 } = params || {};

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Build filters
  let filters = [];

  if (query) {
    filters.push(`(title match "${query}" || description match "${query}")`);
  }

  if (category) {
    // Lọc trực tiếp theo ID của category
    filters.push(`category._ref == "${category}"`);
  }

  const filterString = filters.length > 0 ? `&& ${filters.join(" && ")}` : "";

  // Build the GROQ query
  const queryGroq = groq`
    *[_type == "course" ${filterString}] | order(_createdAt desc) [${offset}...${offset + limit}] {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      "category": category->{ name },
      "author": author->{
        name,
        image
      },
      tags
    }
  `;

  try {
    const courses = await client.fetch(queryGroq);

    return courses.map((course: any) => ({
      ...course,
      image: course.image ? urlFor(course.image).url() : null,
      author: {
        ...course.author,
        image: course.author?.image ? urlFor(course.author.image).url() : null,
      },
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// Get all course IDs for subscription functionality
export async function getAllCourseIds() {
  try {
    const query = groq`
      *[_type == "course"] {
        _id
      }
    `;

    const courses = await client.fetch(query);

    if (!courses || courses.length === 0) {
      return { success: false, data: [] };
    }

    const courseIds = courses.map((course: any) => course._id);

    return { success: true, data: courseIds };
  } catch (error) {
    console.error("Error fetching course IDs:", error);
    return { success: false, error: "Failed to fetch course IDs", data: [] };
  }
}
