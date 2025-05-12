"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/actions/category.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, ChevronDown } from "lucide-react";

const MobileCategorySelect = () => {
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ["mobileNavCategories"],
    queryFn: getCategories,
  });

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      router.push("/courses");
    } else {
      router.push(`/courses?category=${value}`);
    }
  };

  if (error) return null;

  return (
    <Select onValueChange={handleCategoryChange} defaultValue="all">
      <SelectTrigger 
        className="w-[130px] h-8 text-xs bg-white border-primary/20 focus:ring-1 focus:ring-primary rounded-full px-2"
      >
        <div className="flex items-center gap-1 text-gray-700">
          <BookOpen className="w-3 h-3 text-primary" />
          <SelectValue placeholder="Danh mục" />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[60vh] overflow-y-auto z-[100]">
        <SelectItem value="all" className="text-sm">Tất cả khóa học</SelectItem>
        {data?.data?.map((category: any) => (
          <SelectItem 
            key={category._id} 
            value={category._id}
            className="text-sm"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MobileCategorySelect;
