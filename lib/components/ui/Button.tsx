import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ 
  children, 
  variant = "primary", 
  className = "",
  ...props 
}: ButtonProps) {
  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition-all";
  const variantStyle = variant === "primary"
    ? "bg-purple-600 text-white hover:bg-purple-700"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
