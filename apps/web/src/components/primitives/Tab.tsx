"use client";

import type { ReactNode } from "react";

interface TabProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  className?: string;
}

export function Tab({
  label,
  active = false,
  onClick,
  icon,
  badge,
  disabled = false,
  className = "",
}: TabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      role="tab"
      aria-selected={active}
      className={`
        relative inline-flex items-center gap-2 px-4 py-2.5
        text-sm font-medium min-h-[44px]
        rounded-[var(--radius-md)] transition-colors
        ${active
          ? "text-cruze-mint bg-cruze-mint/10"
          : "text-muted hover:text-ink hover:bg-surface-elevated"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {badge !== undefined && (
        <span
          className={`
            inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
            text-xs font-bold rounded-full
            ${active ? "bg-cruze-mint text-midnight" : "bg-surface-elevated text-muted"}
          `}
        >
          {badge}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cruze-mint rounded-full" />
      )}
    </button>
  );
}
