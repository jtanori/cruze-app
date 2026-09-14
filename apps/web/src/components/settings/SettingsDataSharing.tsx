"use client";

import { useTranslations } from "next-intl";
import { Toggle } from "@/components/primitives/Toggle";
import { useMonetizationStore } from "@/stores/monetization";
import { CONSENT_POLICY_VERSION } from "@/lib/consent";

/**
 * S2 — Granular privacy controls.
 *
 * Three independent toggles (contribution, personalized ads, analytics),
 * each writing a versioned consent record. Contribution doubles as the
 * ad-light bargain switch; revoking restores default ad behavior.
 */
export function SettingsDataSharing() {
  const t = useTranslations();
  const contribution = useMonetizationStore((s) => s.contribution);
  const toggleContribution = useMonetizationStore((s) => s.toggleContribution);
  const recordConsent = useMonetizationStore((s) => s.recordConsent);
  const analyticsConsent = useMonetizationStore((s) =>
    s.hasConsent("analytics")
  );
  const adsConsent = useMonetizationStore((s) =>
    s.hasConsent("personalized_ads")
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-ink">{t("privacy.title")}</h2>
        <p className="text-sm text-muted mt-1">{t("privacy.subtitle")}</p>
      </div>

      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
        <div className="px-4 py-3.5">
          <Toggle
            label={t("privacy.contributionTitle")}
            description={t("privacy.contributionBody")}
            checked={contribution.enabled}
            onChange={() => toggleContribution()}
          />
        </div>
        <div className="px-4 py-3.5">
          <Toggle
            label={t("privacy.adsTitle")}
            description={t("privacy.adsBody")}
            checked={adsConsent}
            onChange={(e) =>
              recordConsent("personalized_ads", e.target.checked)
            }
          />
        </div>
        <div className="px-4 py-3.5">
          <Toggle
            label={t("privacy.analyticsTitle")}
            description={t("privacy.analyticsBody")}
            checked={analyticsConsent}
            onChange={(e) => recordConsent("analytics", e.target.checked)}
          />
        </div>
      </div>

      <p className="text-xs text-faint leading-relaxed">
        {t("privacy.revocationNote")}
      </p>
      <p className="text-xs text-faint tabular">
        {t("privacy.policyVersion", { version: CONSENT_POLICY_VERSION })}
      </p>
    </div>
  );
}
