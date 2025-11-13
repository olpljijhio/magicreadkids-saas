import { cn } from "./cn";

export function GradientButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white",
        "bg-gradient-to-r from-[#c471ed] to-[#f64f59] shadow-md hover:shadow-lg transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}