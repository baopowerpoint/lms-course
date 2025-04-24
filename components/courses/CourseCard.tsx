"use client";

import Link from "next/link";
import { Course, categoryNames } from "@/lib/data/courses";
import { formatPrice } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const {
    id,
    title,
    thumbnail,
    price,
    salePrice,
    isNew,
    rating,
    reviewCount,
    category,
    grade,
    lessonsCount,
    durationInMinutes,
    instructor,
  } = course;

  const durationInHours = Math.round(durationInMinutes / 60);

  return (
    <Link 
      href={`/courses/${id}`}
      className="block group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Course thumbnail */}
      <div className={`h-48 relative ${thumbnail} flex items-center justify-center`}>
        <span className="text-4xl">
          {category === "algebra" && "🧮"}
          {category === "geometry" && "📐"}
          {category === "calculus" && "📊"}
          {category === "arithmetic" && "🔢"}
          {category === "statistics" && "📈"}
          {category === "probability" && "🎲"}
        </span>
        
        {/* Badge for new courses */}
        {isNew && (
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            Mới
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Category and grade */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {categoryNames[category]}
          </span>
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            Lớp {grade}
          </span>
        </div>
        
        {/* Course title */}
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex mr-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star}
                className={`w-4 h-4 ${star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600">
            {rating} ({reviewCount} đánh giá)
          </span>
        </div>
        
        {/* Course details */}
        <div className="flex items-center text-xs text-gray-600 mb-3 space-x-2">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {lessonsCount} bài học
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {durationInHours} giờ
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-2"></div>
        
        {/* Instructor and price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-2">
              {instructor.avatar}
            </div>
            <span className="text-xs text-gray-600">{instructor.name}</span>
          </div>
          
          <div className="text-right">
            {salePrice ? (
              <>
                <p className="text-xs text-gray-500 line-through">{formatPrice(price)}</p>
                <p className="text-primary font-bold">{formatPrice(salePrice)}</p>
              </>
            ) : (
              <p className="text-primary font-bold">{formatPrice(price)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
