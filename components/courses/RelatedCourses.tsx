"use client";

import { Course } from "@/lib/data/courses";
import { CourseCard } from "@/components/courses/CourseCard";

interface RelatedCoursesProps {
  currentCourseId: string;
  relatedCourses: Course[];
}

export const RelatedCourses = ({
  currentCourseId,
  relatedCourses,
}: RelatedCoursesProps) => {
  // Ensure we don't show the current course in related courses
  const filteredCourses = relatedCourses.filter(
    (course) => course.id !== currentCourseId
  );

  return (
    <div className="mt-12 py-12 border-t">
      <h2 className="text-2xl font-bold mb-6">Khóa học liên quan</h2>
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Không có khóa học liên quan.</p>
      )}
    </div>
  );
};
