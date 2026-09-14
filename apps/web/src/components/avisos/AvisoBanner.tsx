"use client";

interface AvisoBannerProps {
  className?: string;
}

export function AvisoBanner({ className = "" }: AvisoBannerProps) {
  return (
    <div className={`bg-surface border border-border rounded-[var(--radius-lg)] p-4 sm:p-6 mt-4 sm:mt-6 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        2 new avisos
      </p>
    </div>
  );
}