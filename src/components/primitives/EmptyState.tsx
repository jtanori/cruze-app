"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      size = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: "px-4 py-8 space-y-3",
      md: "px-6 py-12 space-y-4",
      lg: "px-8 py-16 space-y-6",
    };

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center text-center ${sizes[size]} ${className}`}
        {...props}
      >
        {icon && (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-elevated border border-border">
            {icon}
          </div>
        )}
        <h3 className="text-ink text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-muted text-sm max-w-sm leading-relaxed">{description}</p>
        )}
        {action && (
          <div className="mt-2">{action}</div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
