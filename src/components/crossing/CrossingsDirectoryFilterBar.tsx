"use client";

import { SegmentedControl } from "@/components/primitives/SegmentedControl";

export type CountryFilter = "all" | "MX" | "US";
export type ModeFilter = "all" | "vehicle" | "pedestrian" | "commercial";
export type SortOption = "relevance" | "fastest" | "closest" | "name";

interface CrossingsDirectoryFilterBarProps {
  country: CountryFilter;
  onCountryChange: (c: CountryFilter) => void;
  mode: ModeFilter;
  onModeChange: (m: ModeFilter) => void;
  sort?: SortOption;
  onSortChange?: (s: SortOption) => void;
  className?: string;
}

export function CrossingsDirectoryFilterBar({
  country,
  onCountryChange,
  mode,
  onModeChange,
  sort = "relevance",
  onSortChange,
  className = "",
}: CrossingsDirectoryFilterBarProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <SegmentedControl
        options={[
          { value: "all", label: "Todos" },
          { value: "MX", label: "M\u00E9xico" },
          { value: "US", label: "EE. UU." },
        ]}
        value={country}
        onChange={(v) => onCountryChange(v as CountryFilter)}
        fullWidth
      />
      <SegmentedControl
        options={[
          { value: "all", label: "Todos" },
          { value: "vehicle", label: "Auto" },
          { value: "pedestrian", label: "A pie" },
          { value: "commercial", label: "Comercial" },
        ]}
        value={mode}
        onChange={(v) => onModeChange(v as ModeFilter)}
        fullWidth
      />
      {onSortChange && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["relevance", "fastest", "closest", "name"] as SortOption[]).map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                sort === s ? "bg-cruze-mint text-midnight border-cruze-mint" : "bg-surface border-border text-muted"
              }`}
            >
              {s === "relevance" ? "Relevantes" : s === "fastest" ? "M\u00E1s r\u00E1pidos" : s === "closest" ? "M\u00E1s cercanos" : "Nombre"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
