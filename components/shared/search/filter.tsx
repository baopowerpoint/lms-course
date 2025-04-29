"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/lib/actions/category.action";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Filter = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  if(error) return null
  if(isLoading ) return <Loader2 className="animate-spin w-5"/>
  return (
    <div className="w-full mt-2 flex">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn lớp" />
        </SelectTrigger>
        <SelectContent>
          {data?.data?.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
