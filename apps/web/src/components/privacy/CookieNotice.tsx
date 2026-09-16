"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";

const DISMISSED_KEY = "cruze-cookie-notice-dismissed";

/**
 * Lightweight cookie/storage notice (MX-first).
 * Distinct from the privacy acknowledgement: this covers local storage
 * transparency, links the cookies document, and dismisses with one tap.
 * Necessary storage is never presented as optional.
 */
export function CookieNotice() {
  const t = useTranslations();
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISSED_KEY)) {
        setVisible(true);
      }
    } catch {
      // Storage unavailable — stay silent rather than nagging.
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label={t("privacy.cookies.title")}
      className="fixed bottom-[var(--nav-bottom-height)] left-0 right-0 z-[var(--z-overlay)] px-4 pb-3"
    >
      <div className="bg-surface-elevated border border-border rounded-[var(--radius-lg)] p-4 shadow-xl space-y-3">
        <p className="text-sm text-ink font-medium">{t("privacy.cookies.title")}</p>
        <p className="text-xs text-muted leading-relaxed">
          {t("privacy.cookies.body")}{" "}
          <a
            href={`/${locale}/legal/cookies`}
            className="text-cruze-green hover:underline"
          >
            {t("privacy.cookies.link")}
          </a>
        </p>
        <button
          onClick={dismiss}
          className="w-full h-11 rounded-[var(--radius-md)] bg-cruze-green text-dark text-sm font-semibold active:bg-cruze-green/90 transition-colors"
        >
          {t("privacy.cookies.accept")}
        </button>
      </div>
    </div>
  );
}
