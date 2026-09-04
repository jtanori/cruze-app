"use client";

interface CruzeLiveIndicatorProps {
  active?: boolean;
  label?: string;
  className?: string;
}

export function CruzeLiveIndicator({
  active = true,
  label = "LIVE",
  className = "",
}: CruzeLiveIndicatorProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        text-xs font-semibold tracking-wider uppercase tabular
        ${active ? "text-success" : "text-muted"}
        ${className}
      `}
    >
      <span
        className={`
          w-2 h-2 rounded-full shrink-0
          ${active ? "bg-success animate-pulse" : "bg-muted"}
        `}
      />
      {label}
    </span>
  );
}
