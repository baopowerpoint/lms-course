import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface DuolingoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "ghost";
}

export default function Duolingo({
  children,
  className,
  variant = "default",
  ...props
}: DuolingoButtonProps) {
  return (
    <button
      className={cn(
        "box-border inline-block h-11 transform-gpu cursor-pointer touch-manipulation whitespace-nowrap rounded-lg border-b-4 border-solid border-transparent  px-4 py-3 text-center text-sm font-bold uppercase leading-5 tracking-wider text-white outline-none transition-all duration-200 hover:brightness-110 active:border-b-0 active:border-t-4 active:bg-none disabled:cursor-auto",
        className,
        variant === "default" && "bg-green-600",
        variant === "destructive" && "bg-red-600",
        variant === "ghost" && "bg-transparent"
      )}
      role="button"
      {...props}
    >
      <span
        className={cn(
          "absolute inset-0 -z-10 rounded-lg border-b-4 border-solid border-transparent",
          variant === "default" && "bg-green-500",
          variant === "destructive" && "bg-red-500",
          variant === "ghost" && "bg-transparent"
        )}
      />
      {children}
    </button>
  );
}
