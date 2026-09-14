"use client";

import { useTranslations } from "next-intl";
import { Select } from "@/components/primitives/Select";
import { useTravelerStore } from "@/stores/traveler";
import type { CrossingMode, AccessType, DocumentCategory, TrustedTraveler } from "@/types";
import {
  CROSSING_MODES,
  ACCESS_TYPES,
  DOCUMENT_CATEGORIES,
  TRUSTED_TRAVELER,
} from "@/types";

interface SettingsProfileProps {
  className?: string;
}

export function SettingsProfile({ className = "" }: SettingsProfileProps) {
  const t = useTranslations();
  const { profile, setProfile } = useTravelerStore();

  const current = {
    crossingMode: profile?.crossingMode || "personal_vehicle",
    accessType: profile?.accessType || "standard",
    documentCategory: profile?.documentCategory || "unknown",
    trustedTraveler: profile?.trustedTraveler || "none",
  };

  const update = (partial: Partial<typeof current>) => {
    setProfile({ ...current, ...partial } as any);
  };

  return (
    <div className={`space-y-4 sm:space-y-5 ${className}`}>
      <h2 className="text-lg font-bold text-ink">{t("trip.travelerProfile")}</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted">{t("trip.crossingMode")}</label>
          <Select
            value={current.crossingMode}
            onChange={(e) => update({ crossingMode: e.target.value as CrossingMode })}
            options={CROSSING_MODES.map((m) => ({ value: m.id, label: t(m.labelKey) }))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t("trip.accessType")}</label>
          <Select
            value={current.accessType}
            onChange={(e) => update({ accessType: e.target.value as AccessType })}
            options={ACCESS_TYPES.map((a) => ({ value: a.id, label: t(a.labelKey) }))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t("trip.documentCategory")}</label>
          <Select
            value={current.documentCategory}
            onChange={(e) => update({ documentCategory: e.target.value as DocumentCategory })}
            options={DOCUMENT_CATEGORIES.map((d) => ({ value: d.id, label: t(d.labelKey) }))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t("trip.trustedTraveler")}</label>
          <Select
            value={current.trustedTraveler}
            onChange={(e) => update({ trustedTraveler: e.target.value as TrustedTraveler })}
            options={TRUSTED_TRAVELER.map((tt) => ({ value: tt.id, label: t(tt.labelKey) }))}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
