"use client";

import type { HTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";

export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end";
  wrap?: boolean;
}

export const Inline = forwardRef<HTMLDivElement, InlineProps>(
  (
    {
      gap = "md",
      align = "center",
      wrap = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const gaps = {
      none: "gap-0",
      xs: "gap-xs",
      sm: "gap-sm",
      md: "gap-md",
      lg: "gap-lg",
      xl: "gap-xl",
    };

    const aligns = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    };

    return (
      <div
        ref={ref}
        className={`inline-flex ${gaps[gap]} items-${align} ${wrap ? "flex-wrap" : ""} ${className}`}
        {...props}
      />
    );
  }
);

Inline.displayName = "Inline";

export default Inline;
