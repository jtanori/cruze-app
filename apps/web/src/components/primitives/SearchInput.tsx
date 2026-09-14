"use client";

import type { InputHTMLAttributes, ForwardedRef } from "react";
import { forwardRef, useId } from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      label,
      placeholder = "Search...",
      onClear,
      className = "",
      id: providedId,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    return (
      <div className={`w-full relative ${className}`}>
        <label htmlFor={id} className="sr-only">
          Search
        </label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" aria-hidden="true">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" fill="none" />
          </svg>
          <input
            ref={ref}
            id={id}
            type="text"
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full h-11 pl-10 pr-10 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-mint focus:ring-2 focus:ring-cruze-mint/20 focus:ring-offset-2 focus:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--transition-fast)] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            {...props}
          />
          {value && !disabled && (
            <button
              type="button"
              onClick={() => {
                const clearEvent = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
                onChange?.(clearEvent);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-cruze-mint transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
