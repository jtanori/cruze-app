"use client";

import { useState } from "react";
import { SearchInput } from "@/components/primitives/SearchInput";
import { EmptyState } from "@/components/primitives/EmptyState";
import { CrossingsDirectoryExpandedRow } from "./CrossingsDirectoryExpandedRow";
import type { CrossingOperationalStatus } from "./CrossingsDirectoryRow";
import type { CountryFilter, ModeFilter } from "./CrossingsDirectoryFilterBar";
import { CrossingsDirectoryFilterBar } from "./CrossingsDirectoryFilterBar";

export interface DirectoryCrossing {
  id: string;
  crossingName: string;
  status: CrossingOperationalStatus;
  northboundWait: number | null;
  southboundWait: number | null;
  country: "MX" | "US";
  mode: ("vehicle" | "pedestrian" | "commercial")[];
  lanes?: { type: string; waitTime: number | null }[];
  accessTypes?: string[];
  hours?: string;
  services?: string[];
}

interface CrossingsDirectoryListProps {
  crossings: DirectoryCrossing[];
  onViewDetail?: (id: string) => void;
  className?: string;
}

export function CrossingsDirectoryList({ crossings, onViewDetail, className = "" }: CrossingsDirectoryListProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<CountryFilter>("all");
  const [mode, setMode] = useState<ModeFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = crossings.filter((c) => {
    if (query && !c.crossingName.toLowerCase().includes(query.toLowerCase())) return false;
    if (country !== "all" && c.country !== country) return false;
    if (mode !== "all" && !c.mode.includes(mode as never)) return false;
    return true;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar cruces..." />
      <CrossingsDirectoryFilterBar country={country} onCountryChange={setCountry} mode={mode} onModeChange={setMode} />
      {filtered.length === 0 ? (
        <EmptyState title="No se encontraron cruces" description="Intenta con otro t\u00E9rmino o filtro." />
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <CrossingsDirectoryExpandedRow
              key={c.id}
              crossingName={c.crossingName}
              status={c.status}
              northboundWait={c.northboundWait}
              southboundWait={c.southboundWait}
              lanes={c.lanes}
              accessTypes={c.accessTypes}
              hours={c.hours}
              services={c.services}
              expanded={expandedId === c.id}
              onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
              onViewDetail={onViewDetail ? () => onViewDetail(c.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
