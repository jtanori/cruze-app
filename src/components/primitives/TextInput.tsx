"use client";

import type { InputHTMLAttributes, ForwardedRef } from "react";
import { forwardRef, useId } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      clearable,
      className = "",
      id: providedId,
      disabled,
      onChange,
      onBlur,
      value,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const hasError = Boolean(error);
    const hasHint = Boolean(hint);

    const inputClasses =
      "w-full h-12 px-4 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-mint focus:ring-2 focus:ring-cruze-mint/20 focus:ring-offset-2 focus:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--transition-fast)]";

    const handleClear = () => {
      onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      onBlur?.({ target: { value: "" } } as React.FocusEvent<HTMLInputElement>);
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={`${inputClasses} ${leftIcon ? "pl-10" : ""} ${rightIcon || clearable ? "pr-10" : ""}`}
            aria-invalid={hasError}
            aria-describedby={`${hasError ? errorId : ""} ${hasHint ? hintId : ""}`.trim() || undefined}
            aria-disabled={disabled}
            {...restProps}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
              {rightIcon}
            </div>
          )}
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={() => {
                onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-cruze-mint transition-colors"
              aria-label="Clear"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {hasError && (
          <p id={errorId} className="mt-1.5 text-sm text-alert-red" role="alert">
            {error}
          </p>
        )}
        {hint && !hasError && (
          <p id={hintId} className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;