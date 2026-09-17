"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoHideMs?: number;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function Toast({
  variant = "info",
  title,
  children,
  dismissible = true,
  onDismiss,
  autoHideMs = 5000,
  action,
  className = "",
}: ToastProps) {
  const t = useTranslations();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHideMs > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [autoHideMs, onDismiss]);

  if (!visible) return null;

  const variantStyles = {
    info: "bg-surface-elevated border-info/30",
    success: "bg-surface-elevated border-success/30",
    warning: "bg-surface-elevated border-warning/30",
    error: "bg-surface-elevated border-danger/30",
  };

  const iconMap = {
    info: <Info className="w-5 h-5 text-info" />,
    success: <CheckCircle className="w-5 h-5 text-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    error: <AlertCircle className="w-5 h-5 text-danger" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border shadow-[var(--shadow-lg)]
        animate-in slide-in-from-bottom-5 fade-in duration-300
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <span className="shrink-0 mt-0.5">{iconMap[variant]}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm text-muted">{children}</div>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-semibold text-cruze-mint hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="shrink-0 p-1 rounded-[var(--radius-md)] hover:bg-white/10 transition-colors"
          aria-label={t("common.dismiss")}
        >
          <X className="w-4 h-4 text-muted" />
        </button>
      )}
    </div>
  );
}
