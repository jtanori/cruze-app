"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Share2 } from "lucide-react";
import { CrossingDetailHero } from "@/components/crossing/CrossingDetailHero";
import { CrossingDetailMap } from "@/components/crossing/CrossingDetailMap";
import { CrossingDetailLaneSection } from "@/components/crossing/CrossingDetailLaneSection";
import { CrossingDetailHoursSection } from "@/components/crossing/CrossingDetailHoursSection";
import { CrossingDetailActionBar } from "@/components/crossing/CrossingDetailActionBar";
import { CrossingFavoriteButton } from "@/components/crossing/CrossingFavoriteButton";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { Spinner } from "@/components/primitives/Spinner";
import { BORDER_CROSSINGS, haversineDistance } from "@/lib/border-data";
import { fetchMergedCrossings } from "@/lib/crossings";
import { resolveDisplayDirection } from "@/lib/country-resolution";
import { buildSetupUrl } from "@/lib/trip-navigation";
import { buildCrossingSharePayload } from "@/lib/crossing-share";
import { formatFreshness } from "@/lib/format-freshness";
import { useShare } from "@/hooks/use-share";
import { useLocationContext } from "@/components/location/LocationProvider";
import { useTripStore } from "@/stores/trip";
import { useAgentStore } from "@/stores/agent";
import { useTripMapContext } from "@/hooks/useTripMapContext";

interface CrossingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

type LaneCategory = "passenger" | "commercial" | "pedestrian";

function toLaneCategory(value: unknown): LaneCategory | undefined {
  return value === "passenger" || value === "commercial" || value === "pedestrian"
    ? value
    : undefined;
}

interface LiveCrossingData {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  status: "operational" | "limited" | "closed" | "unknown";
  waitTime: number | null;
  southboundWait: number | null;
  direction: "northbound" | "southbound" | "both";
  isLive: boolean;
  lastUpdated?: string;
  hours: string | null;
  lanes: {
    name: string;
    waitTime: number;
    isOpen: boolean;
    category?: LaneCategory;
  }[];
}

export default function CrossingPage({ params }: CrossingPageProps) {
  const { id, locale } = use(params);
  const router = useRouter();
  const t = useTranslations();
  const { share } = useShare();
  const { location } = useLocationContext();
  const tripDirection = useTripStore((s) => s.direction);
  const tripMapContext = useTripMapContext();
  const [crossing, setCrossing] = useState<LiveCrossingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCrossing() {
      try {
        setLoading(true);
        const staticCrossing = BORDER_CROSSINGS.find((c) => c.id === id);
        if (!staticCrossing) {
          setError(t("crossing.notFound"));
          setLoading(false);
          return;
        }

        // Direction hierarchy: trip → contextual → both (never hardcoded).
        const displayDirection = resolveDisplayDirection(
          tripDirection,
          location?.country ?? "UNKNOWN"
        );
        const merged = await fetchMergedCrossings();
        const liveData = merged.find((c) => c.id === id) ?? null;

        if (liveData && liveData.isLive) {
          const northbound = displayDirection !== "US_TO_MX";
          // CBP publishes lane detail northbound-only; lanesSouthbound mirrors
          // northbound lanes upstream, so southbound shows the empty notice
          // instead of mislabeled lanes.
          const sideLanes = northbound ? liveData.lanesNorthbound : [];
          setCrossing({
            id: staticCrossing.id,
            name: staticCrossing.name,
            coordinates: staticCrossing.coordinates,
            status: (northbound
              ? liveData.statusNorthbound
              : liveData.statusSouthbound
            ).toLowerCase() as "operational" | "limited" | "closed" | "unknown",
            waitTime: northbound
              ? liveData.waitTimeNorthbound
              : liveData.waitTimeSouthbound,
            southboundWait:
              displayDirection === null ? liveData.waitTimeSouthbound : null,
            direction:
              displayDirection === "US_TO_MX"
                ? "southbound"
                : displayDirection === "MX_TO_US"
                  ? "northbound"
                  : "both",
            isLive: true,
            lastUpdated: liveData.lastUpdated,
            hours: liveData.hours,
            lanes: sideLanes.map((l) => ({
              name: l.name,
              waitTime: l.waitTime,
              isOpen: l.isOpen,
              category: toLaneCategory(l.category),
            })),
          });
        } else {
          // No live data: explicit unknown state — never invented defaults.
          setCrossing({
            id: staticCrossing.id,
            name: staticCrossing.name,
            coordinates: staticCrossing.coordinates,
            status: "unknown",
            waitTime: null,
            southboundWait: null,
            direction: "both",
            isLive: false,
            lastUpdated: undefined,
            hours: null,
            lanes: [],
          });
        }
      } catch (err) {
        console.error("Error loading crossing:", err);
        const staticCrossing = BORDER_CROSSINGS.find((c) => c.id === id);
        if (staticCrossing) {
          setCrossing({
            id: staticCrossing.id,
            name: staticCrossing.name,
            coordinates: staticCrossing.coordinates,
            status: "unknown",
            waitTime: null,
            southboundWait: null,
            direction: "both",
            isLive: false,
            lastUpdated: undefined,
            hours: null,
            lanes: [],
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadCrossing();
  }, [id, tripDirection, location?.country]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !crossing) {
    return (
      <div className="min-h-dvh bg-background">
        <CruzeBackHeader title={t("crossing.title")} onBack={() => router.push(`/${locale}/crossings`)} />
        <div className="px-5 py-8 sm:py-12 text-center text-muted">{error || t("crossing.notFound")}</div>
      </div>
    );
  }

  const statusLabel =
    crossing.status === "unknown"
      ? null
      : t(
          `common.${crossing.status === "operational" ? "open" : crossing.status === "limited" ? "limited" : "closed"}`
        );

  const handleShare = () => {
    const lastUpdatedMs = crossing.lastUpdated
      ? new Date(crossing.lastUpdated).getTime()
      : null;
    void share(
      buildCrossingSharePayload({
        id: crossing.id,
        name: crossing.name,
        locale,
        statusLabel,
        unknownStatusLabel: t("common.unknownStatus"),
        northLabel: t("common.northbound"),
        southLabel: t("common.southbound"),
        waitNorthbound: crossing.waitTime,
        waitSouthbound: crossing.southboundWait,
        freshnessText:
          lastUpdatedMs !== null && Number.isFinite(lastUpdatedMs)
            ? formatFreshness(lastUpdatedMs, t)
            : null,
        viewInLabel: t("common.viewInCruze"),
      })
    );
  };

  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader
        title={t("crossing.title")}
        onBack={() => router.push(`/${locale}/crossings`)}
        trailing={
          <div className="flex items-center">
            <button
              onClick={handleShare}
              aria-label={t("common.share")}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[var(--radius-md)] active:bg-surface-elevated transition-colors"
            >
              <Share2 className="w-5 h-5 text-ink" />
            </button>
            <CrossingFavoriteButton crossingId={crossing.id} />
          </div>
        }
      />
      <div className="px-4 sm:px-5 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* CR-DET-01: Hero — identity only (actions live in header) */}
        <CrossingDetailHero
          crossingName={crossing.name}
          status={crossing.status}
          waitTime={crossing.waitTime}
          direction={crossing.direction}
          secondaryWaitTime={crossing.southboundWait}
          secondaryEstimated
          secondaryEstimatedLabel={t("crossing.southEstimated")}
          updatedAt={crossing.lastUpdated}
        />

        {/* CR-DET-02: Map */}
        <CrossingDetailMap
          lat={crossing.coordinates.lat}
          lng={crossing.coordinates.lng}
          crossingName={crossing.name}
          origin={tripMapContext.origin}
          destination={tripMapContext.destination}
        />

        {/* CR-DET-03: Lane times — always rendered; empty state explains why */}
        <CrossingDetailLaneSection
          lanes={crossing.lanes.map((l) => ({
            type: l.name,
            waitTime: l.waitTime,
            category: l.category,
          }))}
          emptyNote={
            !crossing.isLive
              ? t("crossing.lanesEmptyNoLive")
              : crossing.direction === "southbound"
                ? t("crossing.lanesEmptySouthbound")
                : t("crossing.lanesEmptyNoDetail")
          }
        />

        {/* CR-DET-05: Hours — only when sourced */}
        {crossing.hours && (
          <CrossingDetailHoursSection
            hours={crossing.hours}
            note={t("crossing.hoursNote")}
          />
        )}

        {/* Contextual agent handoff — quiet text-link, no CTA block */}
        <div>
          <button
            onClick={() => {
              useAgentStore.getState().setPendingContext({
                crossingId: crossing.id,
                crossingName: crossing.name,
              });
              router.push(`/${locale}/agent`);
            }}
            className="min-h-[44px] flex items-center text-sm font-medium text-faint hover:text-ink transition-colors"
          >
            {t("agent.askAboutCrossing")}
          </button>
        </div>
        {/* CR-DET-10: Action Bar — in-flow, inside the content inset */}
        <CrossingDetailActionBar
          onUseCrossing={() => router.push(buildSetupUrl(locale, null, crossing.id))}
          onCompare={() => {
            const alternatives = BORDER_CROSSINGS.filter((c) => c.id !== crossing.id)
              .map((c) => ({
                id: c.id,
                distance: haversineDistance(crossing.coordinates, c.coordinates),
              }))
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 2)
              .map((c) => c.id);
            router.push(
              `/${locale}/crossings/compare?ids=${[crossing.id, ...alternatives].join(",")}`
            );
          }}
        />
      </div>
    </div>
  );
}
