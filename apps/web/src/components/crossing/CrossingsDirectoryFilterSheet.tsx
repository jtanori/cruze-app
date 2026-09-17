"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BottomSheet } from "@/components/primitives/BottomSheet";
import { RadioGroup } from "@/components/primitives/RadioGroup";
import type {
  CrossingsScope,
  CrossingsMode,
  CrossingsStatusFilter,
} from "@/lib/crossings-query";

export interface DirectoryFilters {
  scope: CrossingsScope;
  mode: CrossingsMode;
  status: CrossingsStatusFilter;
}

interface CrossingsDirectoryFilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: DirectoryFilters;
  onApply: (filters: DirectoryFilters) => void;
  /** NEARBY needs a resolved country — otherwise it stays disabled. */
  nearbyAvailable: boolean;
}

const STATUS_ALL: CrossingsStatusFilter = "ALL";

/**
 * CR-DIR-05A — progressive filter disclosure: scope, mode, state.
 * Draft-then-apply; closing discards the draft.
 */
export function CrossingsDirectoryFilterSheet({
  open,
  onClose,
  filters,
  onApply,
  nearbyAvailable,
}: CrossingsDirectoryFilterSheetProps) {
  const t = useTranslations();
  const [draft, setDraft] = useState<DirectoryFilters>(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const hasChanges =
    draft.scope !== filters.scope ||
    draft.mode !== filters.mode ||
    draft.status !== filters.status;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t("crossings.filter.title")}
      footer={
        <button
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          disabled={!hasChanges}
          className="w-full py-3.5 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity min-h-[48px] border border-transparent disabled:bg-surface-elevated disabled:text-faint disabled:border-border disabled:shadow-none disabled:cursor-not-allowed disabled:hover:opacity-100"
        >
          {t("crossings.filter.apply")}
        </button>
      }
    >
      <div className="space-y-6">
        <RadioGroup
          label={t("crossings.filter.scopeLabel")}
          value={draft.scope}
          onChange={(v) => setDraft((d) => ({ ...d, scope: v as CrossingsScope }))}
          options={[
            {
              value: "NEARBY",
              label: t("crossings.filter.nearby"),
              disabled: !nearbyAvailable,
              description: nearbyAvailable
                ? undefined
                : t("crossings.filter.nearbyNeedsCountry"),
            },
            { value: "MX", label: t("crossings.filter.mx") },
            { value: "US", label: t("crossings.filter.us") },
            { value: "ALL", label: t("crossings.filter.allBorder") },
          ]}
        />
        <RadioGroup
          label={t("crossings.filter.modeLabel")}
          value={draft.mode}
          onChange={(v) =>
            setDraft((d) => ({ ...d, mode: v as DirectoryFilters["mode"] }))
          }
          options={[
            { value: "ALL", label: t("crossings.filter.allModes") },
            { value: "VEHICLE", label: t("crossings.filter.vehicle") },
            { value: "WALK", label: t("crossings.filter.walk") },
            { value: "COMMERCIAL", label: t("crossings.filter.commercial") },
          ]}
        />
        <RadioGroup
          label={t("crossings.filter.statusLabel")}
          value={draft.status}
          onChange={(v) =>
            setDraft((d) => ({ ...d, status: v as CrossingsStatusFilter }))
          }
          options={[
            { value: STATUS_ALL, label: t("crossings.filter.allModes") },
            { value: "OPEN", label: t("crossings.filter.open") },
            { value: "LIMITED", label: t("crossings.filter.limited") },
          ]}
        />
      </div>
    </BottomSheet>
  );
}
