"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: "standard" | "confirmation";
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  variant = "standard",
  className = "",
}: ModalProps) {
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
        m-auto w-full max-w-md
        bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-2xl)]
        border border-border overflow-hidden
        backdrop:bg-black/60 backdrop:backdrop-blur-sm
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
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
      <div className="px-5 py-5">{children}</div>
      {variant === "confirmation" && (
        <div className="flex gap-3 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-[var(--radius-lg)] border border-border text-muted font-semibold text-sm hover:bg-surface-elevated transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Confirm
          </button>
        </div>
      )}
    </dialog>
  );
}
