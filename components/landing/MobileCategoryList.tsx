"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getCategories } from "@/lib/actions/category.action";

interface MobileCategoryListProps {
  closeMenu: () => void;
}

const MobileCategoryList = ({ closeMenu }: MobileCategoryListProps) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["mobileCategories"],
    queryFn: getCategories,
  });

  if (error) return null;
  if (isLoading) return (
    <div className="pl-4 py-2 flex items-center">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      <span className="text-gray-500">Đang tải...</span>
    </div>
  );

  return (
    <div className="pl-4 space-y-2">
      {data?.data?.map((category: any) => (
        <Link
          key={category._id}
          href={`/courses?category=${category._id}`}
          className="block py-1.5 text-gray-600 hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default MobileCategoryList;
