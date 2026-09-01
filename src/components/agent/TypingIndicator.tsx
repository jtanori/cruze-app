"use client";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex items-center gap-1 bg-surface-elevated rounded-full px-4 py-2 border border-border">
        <span className="w-1.5 h-1.5 bg-faint rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-faint rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-faint rounded-full animate-bounce" />
      </div>
    </div>
  );
}
