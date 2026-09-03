"use client";

import type { HTMLAttributes } from "react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "mint" | "white";
}

export function Spinner({
  size = "md",
  variant = "default",
  className = "",
  ...props
}: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  const variants = {
    default: "border-cruze-mint border-t-transparent",
    mint: "border-cruze-mint border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div
      className={`${sizes[size]} ${variants[variant]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;
