import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
  error?: Error & { digest?: string };
}

export function ErrorState({
  title = "Something went wrong",
  message,
  icon,
  action,
  className = "",
  error,
}: ErrorStateProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const errorDetails = (() => {
    if (!error || !isDev) return null;
    const enumerables: Record<string, unknown> = {};
    try {
      for (const k of Object.keys(error)) enumerables[k] = (error as any)[k];
    } catch {}
    return {
      name: error.name,
      message: error.message,
      digest: (error as any).digest,
      stack: error.stack,
      ...enumerables,
    };
  })();

  return (
    <div
      className={`flex flex-col items-center justify-center w-full max-w-full overflow-hidden py-8 sm:py-12 px-4 sm:px-6 text-center ${className}`}
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
      {isDev && errorDetails && (
        <details className="mt-6 w-full max-w-full sm:max-w-[560px] mx-auto text-left bg-surface border border-border rounded-[var(--radius-md)] p-3 overflow-hidden">
          <summary className="cursor-pointer text-xs font-mono font-semibold text-faint hover:text-ink">
            Dev — error enumerables
          </summary>
          <pre className="mt-2 max-h-[320px] overflow-auto whitespace-pre-wrap break-words break-all font-mono text-[11px] leading-relaxed text-muted">
            {JSON.stringify(errorDetails, null, 2)}
          </pre>
          {errorDetails.stack && (
            <pre className="mt-3 max-h-[240px] overflow-auto whitespace-pre-wrap break-words break-all font-mono text-[11px] leading-relaxed text-muted/80">
              {String(errorDetails.stack)}
            </pre>
          )}
        </details>
      )}
    </div>
  );
}
