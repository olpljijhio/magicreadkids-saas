"use client";
import { cn } from "./cn";

export function Button({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border hover:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}