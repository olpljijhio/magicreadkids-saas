"use client";
import { cn } from "./cn";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}