"use client";

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "compact" | "prominent" | "ghost";
  size?: "sm" | "md" | "lg";
  ariaLabel: string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      ariaLabel,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint focus-visible:ring-offset-2 focus-visible:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.95]";

    const variants = {
      default: "bg-surface border border-border text-ink hover:bg-surface-elevated active:bg-surface-raised",
      compact: "bg-surface-elevated text-ink hover:bg-surface-raised active:bg-cruze-mint/10",
      prominent: "bg-cruze-mint text-midnight hover:bg-cruze-mint/90 active:bg-cruze-mint active:shadow-mint",
      ghost: "text-ink hover:bg-surface-elevated active:bg-surface-raised",
    };

    const sizes = {
      sm: "w-9 h-9",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;