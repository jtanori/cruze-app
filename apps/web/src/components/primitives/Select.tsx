"use client";

import type { SelectHTMLAttributes, ForwardedRef } from "react";
import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      placeholder,
      options,
      className = "",
      id: providedId,
      disabled,
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

    const selectClasses =
      "w-full h-12 px-4 pr-10 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm focus:outline-none focus:border-cruze-mint focus:ring-2 focus:ring-cruze-mint/20 focus:ring-offset-2 focus:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--transition-fast)] appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23A7B3CC%27 stroke-width=%271.5%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-[right_0.75rem_center] bg-no-repeat pr-10";

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          className={`${selectClasses} ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${error ? errorId : ""} ${hint ? hintId : ""}`.trim() || undefined}
          aria-disabled={disabled}
          {...restProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-alert-red" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;