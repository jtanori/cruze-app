"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useTranslations } from "next-intl";

type CountryFilter = "all" | "MX" | "US";

interface CrossingsFilterContextValue {
  filter: CountryFilter;
  setFilter: (f: CountryFilter) => void;
}

const CrossingsFilterContext = createContext<CrossingsFilterContextValue | null>(null);

export function CrossingsFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<CountryFilter>("MX");
  
  return (
    <CrossingsFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </CrossingsFilterContext.Provider>
  );
}

export function useCrossingsFilter() {
  const context = useContext(CrossingsFilterContext);
  if (!context) {
    throw new Error("useCrossingsFilter must be used within a CrossingsFilterProvider");
  }
  return context;
}

export function CrossingsFilterTabs() {
  const t = useTranslations();
  const { filter, setFilter } = useCrossingsFilter();
  
  return (
    <div className="px-5 py-2 border-b border-border-subtle">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "MX", "US"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as CountryFilter)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              filter === f
                ? "bg-cruze-mint text-midnight"
                : "bg-surface border border-border text-muted hover:text-ink hover:bg-surface-elevated"
            }`}
          >
            {f === "all"
              ? t("crossings.all")
              : f === "MX"
              ? t("crossings.mexico")
              : t("crossings.unitedStates")}
          </button>
        ))}
      </div>
    </div>
  );
}