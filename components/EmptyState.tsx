"use client";

import { Button } from "@/components/ui/button";
import { SearchX, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "search" | "shopping";
  action?: {
    label: string;
    href: string;
  };
}

const EmptyState = ({ 
  title, 
  description, 
  icon = "search",
  action 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        {icon === "search" ? (
          <SearchX className="h-8 w-8 text-gray-400" />
        ) : (
          <ShoppingBag className="h-8 w-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      
      {action && (
        <Button asChild>
          <Link href={action.href}>
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
