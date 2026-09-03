"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className = "",
}: DrawerProps) {
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

  const position = side === "left" ? "left-0 top-0 h-full" : "right-0 top-0 h-full";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={`
        ${position} m-0 max-w-xs
        bg-surface shadow-[var(--shadow-2xl)]
        border-border overflow-hidden
        backdrop:bg-black/60 backdrop:backdrop-blur-sm
        ${side === "left" ? "border-r" : "border-l"}
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-ink font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-[var(--radius-md)] hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
      )}
      <div className="px-5 py-4 overflow-y-auto h-full">{children}</div>
    </dialog>
  );
}
