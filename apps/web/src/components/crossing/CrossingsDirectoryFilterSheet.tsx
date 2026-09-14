"use client";

import { useEffect, useState } from "react";
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
      title="Filtros"
      footer={
        <button
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          disabled={!hasChanges}
          className="w-full py-3.5 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
        >
          Aplicar
        </button>
      }
    >
      <div className="space-y-6">
        <RadioGroup
          label="UBICACIÓN"
          value={draft.scope}
          onChange={(v) => setDraft((d) => ({ ...d, scope: v as CrossingsScope }))}
          options={[
            {
              value: "NEARBY",
              label: "Cerca de ti",
              disabled: !nearbyAvailable,
              description: nearbyAvailable
                ? undefined
                : "Requiere ubicación con país resuelto",
            },
            { value: "MX", label: "México" },
            { value: "US", label: "Estados Unidos" },
            { value: "ALL", label: "Toda la frontera" },
          ]}
        />
        <RadioGroup
          label="MODO"
          value={draft.mode}
          onChange={(v) =>
            setDraft((d) => ({ ...d, mode: v as DirectoryFilters["mode"] }))
          }
          options={[
            { value: "ALL", label: "Todos" },
            { value: "VEHICLE", label: "Vehículo" },
            { value: "WALK", label: "A pie" },
            { value: "COMMERCIAL", label: "Comercial" },
          ]}
        />
        <RadioGroup
          label="ESTADO"
          value={draft.status}
          onChange={(v) =>
            setDraft((d) => ({ ...d, status: v as CrossingsStatusFilter }))
          }
          options={[
            { value: STATUS_ALL, label: "Todos" },
            { value: "OPEN", label: "Abiertos" },
            { value: "LIMITED", label: "Limitados" },
          ]}
        />
      </div>
    </BottomSheet>
  );
}
