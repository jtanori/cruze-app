"use client";

import type { HTMLAttributes } from "react";

export interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function LoadingSkeleton({
  variant = "rectangular",
  width = "100%",
  height = "1rem",
  lines = 1,
  className = "",
  ...props
}: LoadingSkeletonProps) {
  const baseStyles = "animate-pulse bg-surface-elevated rounded";

  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-[var(--radius-md)]",
    card: "rounded-[var(--radius-lg)]",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variants.text} ${i === lines - 1 ? "w-3/4" : "w-full"}`}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  const variantStyles = variants[variant];

  return (
    <div
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}

export default LoadingSkeleton;
