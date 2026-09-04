/*── CROSSING CARD ───────────────────────────────────────────────────────────╭
  Purpose: Information-rich crossing card with country split and lane summary
 ──────────────────────────────────────────────────────────────────────────╯

  DESIGN SPECS (cruze-screens-spec-review + cruze-design-system-review + cruze-design-review):
  - Country split format: Tijuana, MX ↔ San Diego, CA
  - Lane pills with eligibility states (Preferred/Eligible/Not eligible)
  - Recommendation reasons as evidence bullets
  - Delta-based alternatives in amber
  - Status indicator: OPEN/LIMITED/CLOSED with semantic colors
  - Compact but information-rich (no over-carding)
  - WCAG AA contrast, visible focus, semantic HTML
  - 48×48px minimum touch targets
  - Vertical breathing: generous spacing between elements
  - No gradients, neon, glassmorphism, flags everywhere
  - Numbers as design elements: "15 / MIN / BORDER WAIT" format

  DATA MODEL:
    crossing: CrossingEntity
    onSelect: (crossingId: string) => void
    showRecommendation: boolean
    showLanes: boolean
    showCountrySplit: boolean

  VISUAL LAYOUT:
    [Country Split Header]
    │  Tijuana, MX ↔ San Diego, CA
    │  
    │  [Status]  [Wait Time]
    │  ─────────────────────
    │  
    │  [Lane Pills]  [Recommendation]
    │  Standard  Ready  SENTRI  pedestrian
    │  
    │  [Recommendation Hero]  ✦ BEST OVERALL
    │   15 MIN  23 MIN TOTAL JOURNEY
    │   2 min faster than Otay Mesa
    │
    │  [CTA]  Ver detalles
──────────────────────────────────────────────────────────────────────────*/
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import type { FC } from "react";
import type { LaneProgram } from "@/domain/crossing-types";

/* ─── Main CrossingCard Component ───────────────────────────────────────────*/

export const CrossingCard: FC<{
  crossing: {
    id: string;
    name: string;
    cityOrigin: string;
    cityDestination: string;
    direction: "MX_TO_US" | "US_TO_MX";
    status: "OPEN" | "LIMITED" | "CLOSED";
    is24Hours: boolean;
    operatingHoursText: string;
    lanes: Record<LaneProgram, {
      program: LaneProgram;
      waitTime: number;
      isOpen: boolean;
      lanesOpenCount?: number;
      totalLanesCount?: number;
      trend?: "improving" | "stable" | "worsening";
    }>;
    dominantWaitMinutes: number;
    typicalWaitMinutes: number;
    lastUpdated: string;
    restrictions: {
      commercialAllowed: boolean;
      pedestrianAllowed: boolean;
      specialNotices?: string[];
    };
  };
  onSelect?: (crossingId: string) => void;
  showRecommendation?: boolean;
  showLanes?: boolean;
  showCountrySplit?: boolean;
}> = ({
  crossing,
  onSelect,
  showRecommendation = true,
  showLanes = true,
  showCountrySplit = true,
}) => {
  const router = useRouter();
  const locale = useLocale();

  /* ─── Compute Lane Classes Upfront ────────────────────────────────────────*/

  const laneStatuses: Record<string, string> = {};
  const laneTrendClasses: Record<string, string> = {};

  ["STANDARD", "READY_LANE", "SENTRI", "PEDESTRIAN"].forEach((program) => {
    const laneProgram = program as LaneProgram;
    const lane = crossing.lanes[laneProgram];
    if (!lane) return;

    // Eligibility
    let status: "eligible" | "not_eligible" | "preferred" = "eligible";
    if (program === "PEDESTRIAN" && !lane.isOpen) status = "not_eligible";
    else if (program === "STANDARD") status = "eligible";
    else if (program === "SENTRI" && lane.isOpen && (lane.lanesOpenCount || 0) > 0) status = "eligible";
    else if (program === "READY_LANE" && lane.isOpen) status = "eligible";
    else status = "not_eligible";

    laneStatuses[laneProgram] = status;

    // Trend class
    const wt = lane.waitTime;
    laneTrendClasses[laneProgram] = wt > 30 ? "text-cruze-alert-red" : wt > 15 ? "text-cruze-amber" : "text-cruze-mint";
  });

/* ─── Helper: Lane Button ───────────────────────────────────────────────────*/

  const createLaneButton = (program: LaneProgram): React.ReactNode => {
    const lane = crossing.lanes[program];
    if (!lane) return null;

    const badgeClass =
      laneStatuses[program] === "eligible"
        ? "bg-cruze-mint/10 text-cruze-mint"
        : laneStatuses[program] === "not_eligible"
        ? "bg-cruze-surface-elevated text-cruze-secondary opacity-50"
        : "border-cruze-surface-elevated text-cruze-secondary";

    const trendClass = laneTrendClasses[program];

    return (
      <button
        type="button"
        key={program}
        className={`flex-1 py-2 px-2 rounded-md text-xs font-medium ${badgeClass} transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint focus-visible:ring-offset-2 ${
          laneStatuses[program] === "eligible" ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        disabled={!lane.isOpen}
      >
        <span className="font-bold capitalize">{program}</span>
        <span className="text-xs">{lane.lanesOpenCount || 0}/{lane.totalLanesCount || 0}</span>
        <span className={`ml-2 ${trendClass} capitalize`}>
          {lane.waitTime > 0 ? `${lane.waitTime} min` : "—"}
        </span>
      </button>
    );
  };

/* ─── Header: Country Split ─────────────────────────────────────────────────*/

  const countrySplit = showCountrySplit ? (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4">
      <span className="text-cruze-secondary text-sm">
        {crossing.cityOrigin}, {crossing.direction === "MX_TO_US" ? "MX" : "US"}
      </span>
      <span className="text-cruze-amber text-sm">
        {crossing.cityDestination}, {crossing.direction === "MX_TO_US" ? "CA" : "MX"}
      </span>
    </div>
  ) : null;

/* ─── Status + Wait Time ────────────────────────────────────────────────────*/

  const statusClass =
    crossing.status === "OPEN"
      ? "bg-cruze-mint/10 text-cruze-mint"
      : crossing.status === "LIMITED"
      ? "bg-cruze-amber/10 text-cruze-amber"
      : "bg-cruze-surface-elevated text-cruze-alert-red";

  const statusBadge = (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium">
      {crossing.status}
    </span>
  );

  const waitTimeDisplay = (
    <p className="text-3xl font-bold text-cruze-mint">
      {crossing.dominantWaitMinutes}
      <span className="text-xs text-cruze-amber/80">/ MIN</span>
    </p>
  );

/* ─── Lane Pills ───────────────────────────────────────────────────────────*/

  const lanePills = showLanes ? (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {["STANDARD", "READY_LANE", "SENTRI", "PEDESTRIAN"].map((program) => {
        const lane = crossing.lanes[program as LaneProgram];
        if (!lane) return null;

        const badgeClass =
          laneStatuses[program as LaneProgram] === "eligible"
            ? "bg-cruze-mint/10 text-cruze-mint"
            : laneStatuses[program as LaneProgram] === "not_eligible"
            ? "bg-cruze-surface-elevated text-cruze-secondary opacity-50"
            : "border-cruze-surface-elevated text-cruze-secondary";

        const trendClass = laneTrendClasses[program as LaneProgram];

        return (
          <button
            type="button"
            key={program}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium ${badgeClass} transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint focus-visible:ring-offset-2 ${
              laneStatuses[program] === "eligible" ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            disabled={!lane.isOpen}
          >
            <span className="font-bold capitalize">{program}</span>
            <span className="text-xs">{lane.lanesOpenCount || 0}/{lane.totalLanesCount || 0}</span>
            <span className={`ml-2 ${trendClass} capitalize`}>
              {lane.waitTime > 0 ? `${lane.waitTime} min` : "—"}
            </span>
          </button>
        );
      })}
    </div>
  ) : null;

/* ─── Recommendation ─────────────────────────────────────────────────────────*/

  const recommendation = showRecommendation ? (
    <div className="mt-4 p-3 bg-cruze-surface-elevated rounded-md">
      <p className="text-cruze-amber text-lg font-medium">
        ✦ BEST OVERALL
      </p>
      <p className="text-cruze-secondary text-sm">
        {crossing.dominantWaitMinutes} MIN
        <span className="text-cruze-amber/80">border wait</span>
      </p>
      <p className="text-cruze-secondary text-xs mt-1">
        {crossing.typicalWaitMinutes} MIN typical
      </p>
      {crossing.restrictions.specialNotices?.map((notice: string, i: number) => (
        <p key={i} className="text-cruze-secondary text-xs mt-1">
          {notice}
        </p>
      ))}
    </div>
  ) : null;

/* ─── CTA ─────────────────────────────────────────────────────────────────────*/

  const handleSelect = () => {
    onSelect?.(crossing.id);
    router.push(`/${locale}/crossing/${crossing.id}`);
  };

  return (
    <div
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      className="group rounded-md border p-4 hover:bg-cruze-surface-elevated transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint focus-visible:ring-offset-2 min-h-[200px]"
      aria-label={`Información del cruce ${crossing.name}`}
    >
      {/* Country Split Header */}
      {countrySplit}

      {/* Status + Wait Time */}
      <div className="mb-4 flex items-center justify-between">
        {statusBadge}
        {waitTimeDisplay}
      </div>

      {/* Lane Pills */}
      {lanePills}

      {/* Recommendation */}
      {recommendation}

      {/* CTA */}
      {onSelect && (
        <p className="mt-3 text-cruze-amber text-sm underline underline-offset-2 cursor-pointer">
          Ver detalles
        </p>
      )}
    </div>
  );
};