"use client";

import type { InputHTMLAttributes, ForwardedRef } from "react";
import { forwardRef, useId } from "react";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      size = "md",
      className = "",
      id: providedId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const sizes = {
      sm: "w-8 h-5",
      md: "w-11 h-6",
      lg: "w-14 h-7",
    };

    return (
      <label className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
        <div className="relative inline-flex">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-border bg-surface peer-focus:ring-2 peer-focus:ring-cruze-mint peer-focus:ring-offset-2 peer-focus:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--transition-fast)]
              peer-checked:bg-cruze-mint peer-checked:border-cruze-mint
              peer-checked:after:translate-x-full`}
            aria-hidden="true"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
                peer-checked:translate-x-5
              `}
              aria-hidden="true"
            />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label htmlFor={id} className="text-ink text-sm font-medium cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-faint text-xs">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
