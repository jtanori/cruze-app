"use client";

import type { ReactNode } from "react";
import { useState } from "react";

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || options[0]?.value);
  const selected = value ?? internalValue;

  const handleSelect = (val: string) => {
    if (disabled) return;
    setInternalValue(val);
    onChange?.(val);
  };

  const sizeClasses = {
    sm: "h-8 text-xs px-2",
    md: "h-10 text-sm px-3",
    lg: "h-12 text-base px-4",
  };

  return (
    <div
      className={`flex rounded-[var(--radius-lg)] bg-surface border border-border p-1 ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50" : ""} ${className}`}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled || option.disabled}
            onClick={() => handleSelect(option.value)}
            className={`
              flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-md)]
              font-medium transition-all duration-200
              ${sizeClasses[size]}
              ${isSelected
                ? "bg-cruze-mint text-midnight shadow-[var(--shadow-mint)]"
                : "text-muted hover:text-ink hover:bg-surface-elevated"
              }
              ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50
            `}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
