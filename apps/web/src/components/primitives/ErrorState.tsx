import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  icon,
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mb-3 sm:mb-4">
        {icon || <AlertTriangle className="w-7 h-7 text-danger" />}
      </div>
      <h3 className="text-ink font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed mb-4 sm:mb-6">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
