"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/lib/actions/category.action";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";

  const { data, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      // Remove category filter
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      // Apply category filter
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  if (error) return null;
  if (isLoading) return <Loader2 className="animate-spin w-5" />;
  
  return (
    <div className="w-full mt-4 flex items-center gap-2">
      <div className="flex items-center gap-1 text-gray-600">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm">Lọc theo:</span>
      </div>
      <Select 
        defaultValue="all" 
        onValueChange={handleCategoryChange}
        value={categoryParam || "all"}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {data?.data?.map((category) => (
            <SelectItem 
              key={category._id} 
              value={category._id}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
