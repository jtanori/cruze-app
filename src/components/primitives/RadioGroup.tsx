"use client";

import type { ForwardedRef } from "react";
import { forwardRef, useId } from "react";

export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  onChange?: (value: string) => void;
  name?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      error,
      hint,
      options,
      onChange,
      className = "",
      id: providedId,
      disabled,
      name,
      value,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const groupId = providedId || generatedId;

    const handleChange = (value: string) => {
      onChange?.(value);
    };

    return (
      <fieldset
        ref={ref}
        id={groupId}
        className={`w-full ${className}`}
        disabled={disabled}
        aria-describedby={error ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined}
        aria-invalid={error ? "true" : "false"}
        aria-disabled={disabled}
      >
        {label && (
          <legend className="text-sm font-medium text-ink mb-2">
            {label}
          </legend>
        )}
        <div className="space-y-3" role="radiogroup" aria-labelledby={label ? undefined : undefined} aria-describedby={error ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined}>
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name={name || groupId}
                value={option.value}
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                disabled={disabled || option.disabled}
                className="w-4 h-4 mt-0.5 border-2 border-border text-cruze-mint focus:ring-2 focus:ring-cruze-mint focus:ring-offset-2 focus:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
              <div className="flex-1 min-w-0">
                <span className="text-ink text-sm font-medium">{option.label}</span>
                {option.description && (
                  <p className="text-faint text-xs">{option.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-alert-red" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
