"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { getMergedCrossingsData, type MergedCrossingData } from "@/lib/border-data-service";
import { analyzeAllCrossings } from "@/lib/alert-engine";
import { useAlertsStore } from "@/stores/alerts";
import { formatDuration } from "@/lib/display";
import { AppShell } from "@/components/layout/AppShell";

type CountryFilter = "all" | "MX" | "US";

export default function CrossingsPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CountryFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<"MX" | "US" | null>(null);
  const [showCountryPrompt, setShowCountryPrompt] = useState(false);
  const [crossings, setCrossings] = useState<MergedCrossingData[]>([]);
  const [loading, setLoading] = useState(true);
  const { alerts, setAlerts } = useAlertsStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lng = pos.coords.longitude;
          if (lng < -100) {
            setUserCountry("MX");
          } else {
            setUserCountry("US");
          }
        },
        () => {
          setShowCountryPrompt(true);
        }
      );
    } else {
      setShowCountryPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (userCountry) {
      setFilter(userCountry);
      setShowCountryPrompt(false);
    }
  }, [userCountry]);

  useEffect(() => {
    async function loadCrossings() {
      setLoading(true);
      const data = await getMergedCrossingsData();
      setCrossings(data);

      // Run alert engine with previous snapshot
      const prevSnapshot = crossings.length > 0 ? crossings : [];
      const newAlerts = analyzeAllCrossings(data, prevSnapshot);
      if (newAlerts.length > 0) {
        setAlerts([...newAlerts, ...alerts].slice(0, 50));
      }

      setLoading(false);
    }
    loadCrossings();
  }, []);

  const filteredCrossings = useMemo(() => {
    let result = crossings;

    if (filter === "US") {
      result = result.filter((c) => c.country === "US");
    } else if (filter === "MX") {
      result = result.filter((c) => c.country === "MX");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.mexicanCity.toLowerCase().includes(q) ||
          c.usCity.toLowerCase().includes(q) ||
          c.corridor.toLowerCase().includes(q)
      );
    }

    // Sort: OPEN first, then LIMITED, then CLOSED (based on northbound status)
    const statusOrder = { OPEN: 0, LIMITED: 1, CLOSED: 2 };
    return [...result].sort(
      (a, b) => statusOrder[a.statusNorthbound] - statusOrder[b.statusNorthbound]
    );
  }, [crossings, search, filter]);

  const handleSelectCrossing = (crossingId: string) => {
    router.push(`/${locale}/crossing/${crossingId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-improving";
      case "LIMITED":
        return "bg-caution";
      case "CLOSED":
        return "bg-critical";
      default:
        return "bg-faint";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN":
        return t("crossings.open");
      case "LIMITED":
        return t("crossings.limited");
      case "CLOSED":
        return t("crossings.closed");
      default:
        return status;
    }
  };

  // Refs for scrolling expanded cards into view
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  const handleToggleExpand = (id: string) => {
    const newExpandedId = expandedId === id ? null : id;
    setExpandedId(newExpandedId);

    // Scroll expanded card into view after a short delay for render
    if (newExpandedId) {
      setTimeout(() => {
        const cardEl = cardRefs.current.get(newExpandedId);
        if (cardEl) {
          const rect = cardEl.getBoundingClientRect();
          const headerHeight = 80; // Fixed header height including search bar
          const margin = 16;
          const scrollY = window.scrollY + rect.top - headerHeight - margin;
          window.scrollTo({ top: Math.max(0, scrollY), behavior: "smooth" });
        }
      }, 100);
    }
  };

  if (showCountryPrompt) {
    return (
      <AppShell headerVariant="root" hideBottomNav>
        <div className="flex flex-col items-center justify-center px-5 py-32">
          <div className="w-full max-w-sm space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-ink text-xl font-bold">{t("crossings.askLocation")}</h1>
              <p className="text-muted text-sm">{t("crossings.askLocationDescription")}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setUserCountry("MX")}
                className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium hover:bg-surface-elevated transition-colors"
              >
                🇲🇽 {t("crossings.mexico")}
              </button>
              <button
                onClick={() => setUserCountry("US")}
                className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium hover:bg-surface-elevated transition-colors"
              >
                🇺🇸 {t("crossings.unitedStates")}
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      headerVariant="root"
      hasSearch
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder={t("crossings.searchPlaceholder")}
    >
      <div>
        {/* Filter Tabs */}
        <div className="px-5 pb-4">
          <div className="flex gap-2">
            {(["all", "MX", "US"] as CountryFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-cruze-green text-background"
                    : "bg-surface border border-border text-muted hover:text-ink"
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

        {/* Crossings List */}
        <div className="px-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCrossings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink text-sm font-medium">{t("crossings.noResults")}</p>
              <p className="text-faint text-xs mt-1">{t("crossings.noResultsDescription")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCrossings.map((crossing) => {
                const isExpanded = expandedId === crossing.id;
                return (
                  <div
                    key={crossing.id}
                    ref={(el) => setCardRef(crossing.id, el)}
                    className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden"
                  >
                    <button
                      onClick={() => handleToggleExpand(crossing.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-ink text-sm font-medium truncate">
                            {crossing.name}
                          </span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(crossing.statusNorthbound)}`}
                          />
                        </div>
                        <p className="text-faint text-xs mt-0.5 truncate">
                          {crossing.mexicanCity}, MX ↔ {crossing.usCity}, US
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-faint text-[10px]">↑</span>
                            <span className="text-ink text-xs font-medium tabular">
                              {formatDuration(crossing.waitTimeNorthbound)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-faint text-[10px]">↓</span>
                            <span className="text-ink text-xs font-medium tabular">
                              {formatDuration(crossing.waitTimeSouthbound)}
                            </span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-faint" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-faint" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-faint text-xs">↑ Northbound</p>
                            <p className="text-ink text-lg font-bold tabular">
                              {formatDuration(crossing.waitTimeNorthbound)}
                            </p>
                            <p className="text-faint text-[10px]">{getStatusText(crossing.statusNorthbound)}</p>
                          </div>
                          <div>
                            <p className="text-faint text-xs">↓ Southbound</p>
                            <p className="text-ink text-lg font-bold tabular">
                              {formatDuration(crossing.waitTimeSouthbound)}
                            </p>
                            <p className="text-faint text-[10px]">{getStatusText(crossing.statusSouthbound)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              crossing.statusNorthbound === "OPEN"
                                ? "bg-improving-soft text-improving"
                                : crossing.statusNorthbound === "LIMITED"
                                ? "bg-caution-soft text-caution"
                                : "bg-critical-soft text-critical"
                            }`}
                          >
                            {getStatusText(crossing.statusNorthbound)}
                          </span>
                          <span className="text-faint text-xs">
                            {crossing.hours}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const openLanesNorth = crossing.lanesNorthbound.filter((l) => l.isOpen);
                            const openLanesSouth = crossing.lanesSouthbound.filter((l) => l.isOpen);
                            const allOpenLanes = [
                              ...openLanesNorth.map((l) => ({ ...l, direction: "nb" as const })),
                              ...openLanesSouth.map((l) => ({ ...l, direction: "sb" as const })),
                            ];
                            const maxVisible = 3;
                            const visibleLanes = allOpenLanes.slice(0, maxVisible);
                            const remainingCount = allOpenLanes.length - maxVisible;

                            return (
                              <>
                                {visibleLanes.map((lane) => (
                                  <span
                                    key={`${lane.direction}-${lane.category}-${lane.name}`}
                                    className="px-2 py-1 rounded bg-surface-elevated text-faint text-xs font-medium"
                                  >
                                    {lane.direction === "nb" ? "↑" : "↓"} {lane.name}: {lane.waitTime} {t("common.min")}
                                  </span>
                                ))}
                                {remainingCount > 0 && (
                                  <span className="px-2 py-1 rounded bg-surface-elevated text-muted text-xs font-medium">
                                    +{remainingCount} {t("crossings.moreLanes")}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        {crossing.isLive && (
                          <p className="text-faint text-xs">
                            Live data from CBP
                          </p>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCrossing(crossing.id);
                          }}
                          className="w-full h-[40px] flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:bg-brand-dark rounded-[var(--radius-md)] text-white text-sm font-semibold transition-colors"
                        >
                          {t("onboarding.recommendation.startTrip")}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
