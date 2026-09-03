"use client";

import type { HTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "subtle" | "strong";
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      variant = "default",
      className = "",
      ...props
    },
    ref
  ) => {
    const variants = {
      horizontal: {
        default: "border-t border-border",
        subtle: "border-t border-border-subtle",
        strong: "border-t border-border-strong",
      },
      vertical: {
        default: "border-l border-border",
        subtle: "border-l border-border-subtle",
        strong: "border-l border-border-strong",
      },
    };

    return (
      <hr
        ref={ref}
        className={`${variants[orientation][variant]} ${className}`}
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export default Divider;
