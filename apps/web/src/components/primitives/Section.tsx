"use client";

import type { HTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";

export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      variant = "default",
      padding = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-transparent",
      card: "bg-surface border border-border rounded-[var(--radius-lg)]",
      elevated: "bg-surface-elevated rounded-[var(--radius-lg)]",
      outlined: "bg-surface border border-border rounded-[var(--radius-lg)]",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    };

    return (
      <div
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        className={`${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";

export default Section;
