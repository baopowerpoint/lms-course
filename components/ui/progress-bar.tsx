import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  valueClassName?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  valueClassName,
  showPercentage = true,
}: ProgressBarProps) {
  // Calculate percentage with limits
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Dynamically generate tailwind width classes based on percentage
  // Tailwind supports percentage widths from 0 to 100 in increments of 1
  const widthClass = `w-[${Math.round(percentage)}%]`;
  
  return (
    <div className="flex items-center space-x-2">
      <div className={cn("flex-1 h-2 bg-gray-200 rounded-full overflow-hidden", className)}>
        <div
          className={cn(
            "h-full bg-primary rounded-full transition-all duration-300", 
            widthClass,
            valueClassName
          )}
        />
      </div>
      {showPercentage && (
        <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
      )}
    </div>
  );
}
