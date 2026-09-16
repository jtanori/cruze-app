"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { BottomSheet } from "@/components/primitives/BottomSheet";
import { usePrivacyStore } from "@/stores/privacy";
import { useMonetizationStore } from "@/stores/monetization";
import { useLocationContext } from "@/components/location/LocationProvider";

/**
 * PRIV-01 — First-use privacy bottom sheet.
 *
 * Shows once per privacy document version, after init and before
 * personalized functionality. Location and push permissions stay separate
 * flows. Necessary processing is never presented as optional.
 */
export function PrivacySheet() {
  const t = useTranslations();
  const locale = useLocale();
  const [docVersion, setDocVersion] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const acknowledge = usePrivacyStore((s) => s.acknowledge);
  const recordConsent = useMonetizationStore((s) => s.recordConsent);
  const { location } = useLocationContext();
  const jurisdiction =
    location?.country === "MX" || location?.country === "US"
      ? location.country
      : "UNKNOWN";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/legal/versions")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const version: string | undefined = data?.versions?.privacy?.version;
        if (!version) return;
        setDocVersion(version);
        if (!usePrivacyStore.getState().isAcknowledged(version)) {
          setVisible(true);
        }
      })
      .catch(() => {
        // Version check is best-effort; a failed check never blocks the app.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible || !docVersion) return null;

  const accept = (withOptionals: boolean) => {
    acknowledge({
      documentKey: "privacy",
      documentVersion: docVersion,
      locale,
      jurisdiction,
      withOptionals,
    });
    // "Without optionals" explicitly denies the optional set.
    if (!withOptionals) {
      recordConsent("analytics", false);
      recordConsent("personalized_ads", false);
    }
    setVisible(false);
  };

  return (
    <BottomSheet open={visible} onClose={() => {}} variant="detail">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {t("privacy.sheet.eyebrow")}
        </p>
        <h2 className="text-ink text-lg font-bold">{t("privacy.sheet.title")}</h2>
        <p className="text-sm text-muted leading-relaxed">
          {t("privacy.sheet.body")}{" "}
          <a
            href={`/${locale}/legal/privacy`}
            className="text-cruze-green hover:underline"
          >
            {t("privacy.sheet.fullNotice")}
          </a>
        </p>
        <div className="space-y-2">
          <button
            onClick={() => accept(true)}
            className="w-full h-12 rounded-[var(--radius-md)] bg-cruze-green text-dark text-sm font-semibold active:bg-cruze-green/90 transition-colors"
          >
            {t("privacy.sheet.continue")}
          </button>
          <button
            onClick={() => accept(false)}
            className="w-full h-12 rounded-[var(--radius-md)] bg-surface-elevated border border-border text-ink text-sm font-medium transition-colors"
          >
            {t("privacy.sheet.continueWithout")}
          </button>
          <a
            href={`/${locale}/settings/data-sharing`}
            className="block w-full text-center text-sm text-faint hover:text-ink transition-colors py-2"
          >
            {t("privacy.sheet.configure")}
          </a>
        </div>
      </div>
    </BottomSheet>
  );
}
