"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface BannerProps {
  variant?: "info" | "warning" | "error" | "success";
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function Banner({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  action,
  className = "",
}: BannerProps) {
  const variantStyles = {
    info: "bg-info/10 border-info/30 text-info",
    warning: "bg-warning/10 border-warning/30 text-warning",
    error: "bg-danger/10 border-danger/30 text-danger",
    success: "bg-success/10 border-success/30 text-success",
  };

  const iconColor = {
    info: "text-info",
    warning: "text-warning",
    error: "text-danger",
    success: "text-success",
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {icon && (
        <span className={`shrink-0 mt-0.5 ${iconColor[variant]}`}>
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-1">{title}</p>
        )}
        <div className="text-sm leading-relaxed opacity-90">{children}</div>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-[var(--radius-md)] hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
