"use client";

import { useState } from "react";
import { categoryNames, type CourseCategory } from "@/lib/data/courses";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
  selectedCategories: CourseCategory[];
  selectedGrades: number[];
  priceRange: [number, number];
  onCategoryChange: (category: CourseCategory) => void;
  onGradeChange: (grade: number) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

export const FilterSidebar = ({
  selectedCategories,
  selectedGrades,
  priceRange,
  onCategoryChange,
  onGradeChange,
  onPriceRangeChange,
  onReset,
}: FilterSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Convert categories object to array for mapping
  const categories = Object.entries(categoryNames).map(([key, value]) => ({
    id: key as CourseCategory,
    name: value,
  }));
  
  const grades = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Price preset filters
  const pricePresets: Array<{ label: string; range: [number, number] }> = [
    { label: "Tất cả", range: [0, 1000000] },
    { label: "Dưới 300.000đ", range: [0, 300000] },
    { label: "300.000đ - 500.000đ", range: [300000, 500000] },
    { label: "Trên 500.000đ", range: [500000, 1000000] },
  ];

  const handlePricePresetChange = (range: [number, number]) => {
    onPriceRangeChange(range);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Bộ lọc</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="text-xs h-8"
        >
          Đặt lại
        </Button>
      </div>
      
      {/* Mobile toggle */}
      <button 
        className="lg:hidden flex w-full items-center justify-between py-2 font-medium"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Xem bộ lọc
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`space-y-6 ${isExpanded ? "block" : "hidden lg:block"}`}>
        {/* Categories filter */}
        <div>
          <h3 className="font-medium mb-3">Chủ đề</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => onCategoryChange(category.id)}
                />
                <label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Grade filter */}
        <div>
          <h3 className="font-medium mb-3">Lớp</h3>
          <div className="grid grid-cols-3 gap-2">
            {grades.map((grade) => (
              <div key={grade} className="flex items-center space-x-2">
                <Checkbox 
                  id={`grade-${grade}`}
                  checked={selectedGrades.includes(grade)}
                  onCheckedChange={() => onGradeChange(grade)}
                />
                <label 
                  htmlFor={`grade-${grade}`}
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Lớp {grade}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price filter */}
        <div>
          <h3 className="font-medium mb-3">Học phí</h3>
          <div className="space-y-2">
            {pricePresets.map((preset, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`price-${index}`}
                  checked={
                    priceRange[0] === preset.range[0] && 
                    priceRange[1] === preset.range[1]
                  }
                  onCheckedChange={() => handlePricePresetChange(preset.range)}
                />
                <label 
                  htmlFor={`price-${index}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {preset.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
