"use client";

import { Download, X, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePwaInstall } from "@/hooks/usePwaInstall";

/**
 * Settings install surface: one-tap Android install, iOS share-sheet
 * guidance, hidden when already installed or dismissed.
 */
export function PwaInstallRow() {
  const t = useTranslations();
  const { canInstall, showIOSGuide, isStandalone, promptInstall, dismiss } =
    usePwaInstall();

  if (isStandalone || (!canInstall && !showIOSGuide)) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("pwa.section")}</p>
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-cruze-green shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-ink">{t("pwa.installTitle")}</p>
            <p className="text-xs text-faint mt-0.5">
              {canInstall ? t("pwa.installBody") : t("pwa.iosGuide")}
            </p>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="p-1.5 rounded text-faint hover:text-ink transition-colors"
          aria-label={t("common.close")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {canInstall ? (
        <button
          onClick={() => promptInstall()}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-cruze-green text-dark text-sm font-semibold active:bg-cruze-green/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          {t("pwa.installAction")}
        </button>
      ) : (
        <p className="flex items-center gap-2 text-xs text-muted">
          <Share className="w-4 h-4 shrink-0" />
          {t("pwa.iosSteps")}
        </p>
      )}
      </div>
    </div>
  );
}
