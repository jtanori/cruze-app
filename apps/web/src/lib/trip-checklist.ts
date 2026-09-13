import type { LiveCrossingSnapshot } from "./live-crossing/types";
import type { SelectedCrossing } from "./recommendation/types";
import type { ChecklistItem } from "@/components/trip/TripChecklistSection";

type T = (key: string, values?: Record<string, any>) => string;

interface BuildChecklistInput {
  liveSnapshot: LiveCrossingSnapshot | null;
  recommendedCrossing: SelectedCrossing | null;
  t: T;
}

/**
 * P2 — Build ANTES DE CRUZAR checklist items.
 *
 * Operational + freshness derive from the live snapshot when present,
 * falling back to the committed SelectedCrossing. Never mutates trip state.
 */
export function buildTripChecklistItems({
  liveSnapshot,
  recommendedCrossing,
  t,
}: BuildChecklistInput): ChecklistItem[] {
  const liveStatus = liveSnapshot?.status ?? recommendedCrossing?.status;
  const generatedAt = liveSnapshot?.generatedAt ?? recommendedCrossing?.generatedAt;
  const mins = generatedAt
    ? Math.floor((Date.now() - new Date(generatedAt).getTime()) / 60000)
    : null;

  return [
    {
      id: "operational",
      label: t("trip.checklist.operational"),
      status:
        liveStatus === "open"
          ? "checked"
          : liveStatus === "limited"
            ? "warning"
            : "unchecked",
    },
    {
      id: "freshness",
      label: t("trip.checklist.freshness"),
      status:
        mins === null ? "unchecked" : mins < 30 ? "checked" : mins < 60 ? "warning" : "unchecked",
      detail:
        mins === null
          ? undefined
          : t("trip.checklist.freshnessDetail", { minutes: mins }),
    },
    { id: "docs", label: t("trip.checklist.docs"), status: "unchecked" },
    {
      id: "restrictions",
      label: t("trip.checklist.restrictions"),
      status: "unchecked",
    },
  ];
}
