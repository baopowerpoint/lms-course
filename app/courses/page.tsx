"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { FilterSidebar } from "@/components/courses/FilterSidebar";
import { SortOptions, type SortOption } from "@/components/courses/SortOptions";
import { courses, type CourseCategory } from "@/lib/data/courses";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<CourseCategory[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  
  // Mobile filter toggle
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  
  // Filtered courses
  const [filteredCourses, setFilteredCourses] = useState(courses);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...courses];

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((course) => selectedCategories.includes(course.category));
    }

    // Apply grade filter
    if (selectedGrades.length > 0) {
      result = result.filter((course) => selectedGrades.includes(course.grade));
    }

    // Apply price filter
    result = result.filter(
      (course) => {
        const coursePrice = course.salePrice || course.price;
        return coursePrice >= priceRange[0] && coursePrice <= priceRange[1];
      }
    );

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "price-low":
        result.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case "most-popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setFilteredCourses(result);
  }, [selectedCategories, selectedGrades, priceRange, sortOption]);

  // Toggle category selection
  const handleCategoryChange = (category: CourseCategory): void => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Toggle grade selection
  const handleGradeChange = (grade: number): void => {
    setSelectedGrades((prev) => {
      if (prev.includes(grade)) {
        return prev.filter((g) => g !== grade);
      } else {
        return [...prev, grade];
      }
    });
  };

  // Reset all filters
  const handleResetFilters = (): void => {
    setSelectedCategories([]);
    setSelectedGrades([]);
    setPriceRange([0, 1000000]);
    setSortOption("newest");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary/10 to-emerald-400/10 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Khám phá các khóa học
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Tiếp cận hơn 200 khóa học toán học chất lượng cao với đội ngũ giáo viên giàu kinh nghiệm.
            Lọc và tìm kiếm khóa học phù hợp với nhu cầu của bạn.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <Button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
            className="w-full flex items-center justify-between"
          >
            <span>Bộ lọc</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar - Mobile */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 bg-gray-800/50 z-40 flex items-end">
              <div className="bg-white p-4 w-full max-h-[80vh] overflow-y-auto rounded-t-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Bộ lọc</h2>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500"
                    aria-label="Đóng bộ lọc"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <FilterSidebar 
                  selectedCategories={selectedCategories}
                  selectedGrades={selectedGrades}
                  priceRange={priceRange}
                  onCategoryChange={handleCategoryChange}
                  onGradeChange={handleGradeChange}
                  onPriceRangeChange={setPriceRange}
                  onReset={handleResetFilters}
                />
                
                <div className="mt-6">
                  <Button 
                    className="w-full" 
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Áp dụng bộ lọc
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Filter sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar 
              selectedCategories={selectedCategories}
              selectedGrades={selectedGrades}
              priceRange={priceRange}
              onCategoryChange={handleCategoryChange}
              onGradeChange={handleGradeChange}
              onPriceRangeChange={setPriceRange}
              onReset={handleResetFilters}
            />
          </div>
          
          {/* Course listing */}
          <div className="flex-1">
            <SortOptions 
              selectedSort={sortOption}
              onSortChange={setSortOption}
              resultCount={filteredCourses.length}
            />
            
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Không tìm thấy khóa học</h3>
                <p className="text-gray-600 mb-4">
                  Không có khóa học nào phù hợp với bộ lọc hiện tại. Vui lòng thử lại với các bộ lọc khác.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                >
                  Đặt lại bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
