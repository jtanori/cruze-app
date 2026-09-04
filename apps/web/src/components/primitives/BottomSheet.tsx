"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: "standard" | "action" | "detail";
  showHandle?: boolean;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  variant = "standard",
  showHandle = true,
  className = "",
}: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={`
        bottom-0 top-auto w-full max-w-md lg:max-w-xl xl:max-w-2xl
        bg-surface rounded-t-[var(--radius-xl)] shadow-[var(--shadow-2xl)]
        border border-border overflow-hidden
        backdrop:bg-black/60 backdrop:backdrop-blur-sm
        ${className}
      `}
    >
      {showHandle && (
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
      )}
      {title && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-ink font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-[var(--radius-md)] hover:bg-surface-elevated transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
      )}
      <div className="px-5 py-4 max-h-[70vh] overflow-y-auto overscroll-contain">
        {children}
      </div>
      {variant === "action" && (
        <div className="px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      )}
    </dialog>
  );
}
