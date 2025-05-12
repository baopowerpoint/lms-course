"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, BookOpen } from "lucide-react";
import { getCategories } from "@/lib/actions/category.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const CategoryDropdown = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["navbarCategories"],
    queryFn: getCategories,
  });

  if (error) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none">
        <BookOpen className="h-4 w-4" />
        Danh mục khóa học
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-2">
        <DropdownMenuLabel className="text-primary">
          Danh mục khóa học
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-sm text-gray-500">Đang tải danh mục...</span>
          </div>
        ) : (
          <>
            <DropdownMenuItem 
              className="rounded hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary" 
              asChild
            >
              <Link href="/courses" className="w-full cursor-pointer py-2 px-1">
                <span className="font-medium">Tất cả khóa học</span>
              </Link>
            </DropdownMenuItem>
            
            {data?.data?.map((category: any) => (
              <DropdownMenuItem 
                key={category._id} 
                className="rounded hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                asChild
              >
                <Link 
                  href={`/courses?category=${category._id}`}
                  className="w-full cursor-pointer py-2 px-1"
                >
                  {category.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropdown;
