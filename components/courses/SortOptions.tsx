"use client";

import { useState } from "react";

export type SortOption = "newest" | "price-low" | "price-high" | "most-popular";

interface SortOptionsProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

export const SortOptions = ({
  selectedSort,
  onSortChange,
  resultCount,
}: SortOptionsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "newest", label: "Mới nhất" },
    { value: "price-low", label: "Giá tăng dần" },
    { value: "price-high", label: "Giá giảm dần" },
    { value: "most-popular", label: "Phổ biến nhất" },
  ];

  const selectedLabel = sortOptions.find(option => option.value === selectedSort)?.label || "Sắp xếp";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <div className="text-sm text-gray-600 mb-3 sm:mb-0">
        Hiển thị <span className="font-medium">{resultCount}</span> kết quả
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full sm:w-48 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg"
        >
          <span className="font-medium">{selectedLabel}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  selectedSort === option.value ? "bg-primary/5 text-primary font-medium" : ""
                }`}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
