"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Optional fixed footer toolbar (e.g. Aplicar). Sticky, not scrolled. */
  footer?: ReactNode;
  variant?: "standard" | "action" | "detail";
  showHandle?: boolean;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  variant = "standard",
  showHandle = true,
  className = "",
}: BottomSheetProps) {
  const t = useTranslations();
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      try {
        el.showModal();
      } catch {
        // already open or not in DOM
      }
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Lock page scroll while sheet is open; sheet itself remains scrollable
  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  const sheet = (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // backdrop click closes
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ width: "calc(100vw - 1rem)", maxWidth: "28rem" }}
      className={`
        m-0 p-0 lg:max-w-xl xl:max-w-2xl left-1/2 -translate-x-1/2 bottom-0 top-auto
        bg-surface rounded-t-[var(--radius-xl)] shadow-[var(--shadow-2xl)]
        border border-border overflow-hidden
        backdrop:bg-black/60 backdrop:backdrop-blur-sm
        max-h-[85vh] hidden open:flex open:flex-col
        ${className}
      `}
    >
      {showHandle && (
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
      )}
      {title && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <h2 className="text-ink font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-[var(--radius-md)] hover:bg-surface-elevated transition-colors"
            aria-label={t("common.close")}
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
        {children}
      </div>
      {footer && (
        <div className="shrink-0 sticky bottom-0 bg-surface border-t border-border px-5 py-4">
          {footer}
        </div>
      )}
      {variant === "action" && !footer && (
        <div className="shrink-0 px-5 py-4 border-t border-border">
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

  if (!mounted) return null;
  return createPortal(sheet, document.body);
}
