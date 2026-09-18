"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { useLocationContext } from "@/components/location/LocationProvider";
import { useTripStore } from "@/stores/trip";
import { useCrossingsCompare } from "@/hooks/useCrossingsCompare";
import { CrossingsCompareTable } from "@/components/crossing/CrossingsCompareTable";
import { LoadingSkeleton } from "@/components/primitives/LoadingSkeleton";
import { ErrorState } from "@/components/primitives/ErrorState";
import { EmptyState } from "@/components/primitives/EmptyState";
import { buildSetupUrl } from "@/lib/trip-navigation";
import type { CompareTravelMode } from "@/lib/crossings-compare";

function CompareContent() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { location } = useLocationContext();
  const tripDirection = useTripStore((s) => s.direction);
  const tripStart = useTripStore((s) => s.start);
  const tripDestination = useTripStore((s) => s.destination);

  const ids = (searchParams?.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const modeParam = searchParams?.get("mode");
  const mode: CompareTravelMode =
    modeParam === "VEHICLE" || modeParam === "WALK" || modeParam === "COMMERCIAL"
      ? modeParam
      : null;

  const compare = useCrossingsCompare({
    ids,
    location,
    tripDirection,
    tripOrigin: tripStart
      ? { lat: tripStart.latitude, lng: tripStart.longitude }
      : null,
    tripOriginName: tripStart?.name ?? null,
    tripDestinationName: tripDestination?.name ?? null,
    mode,
  });

  return (
    <div className="px-4 sm:px-5 py-4 sm:py-6 space-y-6">
      {/* Page identity */}
      <div className="space-y-2">
        <h1 className="font-display text-lg font-bold text-ink tracking-tight">
          {t("crossings.compare.title")}
        </h1>
        <p className="text-sm text-secondary leading-relaxed text-balance">
          {t("crossings.compare.subtitle")}
        </p>
      </div>

      {/* Context badge */}
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border text-xs font-medium text-secondary">
        {compare.contextLabel}
        {ids.length > 0 && (
          <span className="text-muted">
            · {ids.length} {ids.length === 1 ? "cruce" : "cruces"}
          </span>
        )}
      </div>

      {/* Content states */}
      {compare.loading ? (
        <div className="space-y-3" role="status" aria-label="Cargando comparación">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} variant="card" height="4rem" />
          ))}
        </div>
      ) : compare.unavailable ? (
        <ErrorState
          title={t("crossings.compare.unavailableTitle")}
          message={t("crossings.compare.unavailableBody")}
          action={{ label: t("crossings.compare.retry"), onClick: compare.retry }}
        />
      ) : compare.rows.length === 0 ? (
        <EmptyState
          title={t("crossings.compare.emptyTitle")}
          description={t("crossings.compare.emptyBody")}
        />
      ) : (
        <CrossingsCompareTable
          rows={compare.rows}
          lastUpdatedById={compare.lastUpdatedById}
          bothDirections={compare.bothDirections}
          onSelect={(id) => router.push(buildSetupUrl(locale, null, id))}
        />
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
