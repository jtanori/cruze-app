"use client";

import type { InputHTMLAttributes, ForwardedRef } from "react";
import { forwardRef, useId } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      indeterminate,
      className = "",
      id: providedId,
      disabled,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const checkboxClasses =
      "w-5 h-5 rounded border-2 border-border bg-surface text-cruze-mint focus:outline-none focus:ring-2 focus:ring-cruze-mint focus:ring-offset-2 focus:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--transition-fast)]";

    // We need to handle indeterminate separately since it's not in InputHTMLAttributes
    const inputProps: InputHTMLAttributes<HTMLInputElement> = {
      ...restProps,
      // Remove indeterminate from restProps if it exists
    } as InputHTMLAttributes<HTMLInputElement>;
    delete (restProps as any).indeterminate;

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            disabled={disabled}
            className={checkboxClasses}
            aria-describedby={restProps["aria-describedby"]}
            {...restProps}
          />
          {indeterminate && (
            <script
              dangerouslySetInnerHTML={{
                __html: `document.getElementById('${id}').indeterminate = true;`
              }}
            />
          )}
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
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
