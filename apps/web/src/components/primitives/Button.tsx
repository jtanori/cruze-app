"use client";

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { useTranslations } from "next-intl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const t = useTranslations();

    // Disabled treatment is per-variant, never bare opacity: a filled button
    // at 40% reads as decoration on surfaced backgrounds. Primary goes
    // hollow (solid, clearly inert); hollow variants keep dimming.
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-[var(--radius-md)] transition-all duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint focus-visible:ring-offset-2 focus-visible:ring-offset-midnight disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary: "bg-cruze-mint text-midnight hover:bg-cruze-mint/90 active:bg-cruze-mint active:shadow-mint disabled:bg-surface-elevated disabled:text-faint disabled:border disabled:border-border disabled:shadow-none",
      secondary: "bg-surface border border-border text-ink hover:bg-surface-elevated active:bg-surface-raised disabled:opacity-50",
      ghost: "text-ink hover:bg-surface-elevated active:bg-surface-raised disabled:opacity-50",
      destructive: "bg-alert-red text-white hover:bg-alert-red/90 active:bg-alert-red active:shadow-red disabled:opacity-50",
      outline: "border border-border bg-transparent text-ink hover:bg-surface-elevated active:bg-surface-raised disabled:opacity-50",
    };

    const sizes = {
      sm: "h-10 px-3 text-sm gap-1.5",
      md: "h-12 px-4 text-sm gap-2",
      lg: "h-14 px-4 sm:px-6 text-base gap-2",
      xl: "h-16 px-4 sm:px-8 text-lg gap-2.5",
    };

    const width = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">{t("common.loading")}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;