"use client";

import type { HTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "recommendation" | "count" | "new";
  size?: "sm" | "md" | "lg";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "neutral",
      size = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      neutral: "bg-surface border border-border text-ink",
      recommendation: "bg-cruze-mint/10 text-cruze-mint border border-cruze-mint/20",
      count: "bg-cruze-mint text-midnight",
      new: "bg-alert-red text-white",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center justify-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;