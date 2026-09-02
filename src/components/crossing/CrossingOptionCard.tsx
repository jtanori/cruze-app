"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { Clock, TrendingUp, MapPin, ArrowRight, CheckCircle2, Bookmark, Share2, BookmarkCheck, Car, Navigation, User, Truck, CircleAlert, ChevronDown, Info, Shield } from "lucide-react";
import { formatDuration } from "@/lib/display";

type CrossingStatus = "OPEN" | "LIMITED" | "CLOSED";

interface LaneInfo {
  name: string;
  waitTime: number;
  direction: "MX_TO_US" | "US_TO_MX";
  isOpen: boolean;
  category: string;
  program: string;
}

interface CrossingOptionCardProps {
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  status: CrossingStatus;
  waitTime: number;
  totalJourneyTime?: number;
  deltaMinutes?: number;
  direction?: "MX_TO_US" | "US_TO_MX";
  isRecommended?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClick?: () => void;
  lanes?: LaneInfo[];
  lastUpdated?: string;
  showBookmark?: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  selectedLane?: LaneInfo | null;
  onSelectLane?: (lane: LaneInfo) => void;
  showLiveStatus?: boolean;
  generatedAt?: string;
}

const getStatusColor = (status: CrossingStatus): string => {
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

const getStatusColorSoft = (status: CrossingStatus): string => {
  switch (status) {
    case "OPEN":
      return "bg-improving-soft text-improving";
    case "LIMITED":
      return "bg-caution-soft text-caution";
    case "CLOSED":
      return "bg-critical-soft text-critical";
    default:
      return "bg-faint text-faint";
  }
};

const getStatusText = (status: CrossingStatus, t: ReturnType<typeof useTranslations>): string => {
  switch (status) {
    case "OPEN":
      return t("crossings.open");
    case "LIMITED":
      return t("crossings.limited");
    case "CLOSED":
      return t("crossings.closed");
    default:
      return t("crossings.unknown");
  }
};

const getDirectionArrow = (dir: "MX_TO_US" | "US_TO_MX"): string => {
  return dir === "MX_TO_US" ? "↑" : "↓";
};

export const CrossingOptionCard: FC<CrossingOptionCardProps> = ({
  crossingName,
  mexicanCity,
  usCity,
  status,
  waitTime,
  totalJourneyTime,
  deltaMinutes,
  direction = "MX_TO_US",
  isRecommended = false,
  isExpanded = false,
  onToggleExpand,
  onClick,
  lanes = [],
  lastUpdated,
  showBookmark = false,
  isFavorited = false,
  onToggleFavorite,
  onShare,
  selectedLane,
  onSelectLane,
  showLiveStatus = true,
  generatedAt,
}) => {
  const t = useTranslations();
  const statusColor = getStatusColor(status);
  const statusColorSoft = getStatusColorSoft(status);
  const statusText = getStatusText(status, t);

  const handleClick = () => {
    if (onClick) onClick();
    else if (onToggleExpand) onToggleExpand();
  };

  const openLanes = lanes.filter((l) => l.isOpen);
  const maxVisible = 4;
  const visibleLanes = openLanes.slice(0, maxVisible);
  const remainingCount = openLanes.length - maxVisible;

  // Calculate total journey including approach time
  const borderWait = waitTime;
  const totalJourney = totalJourneyTime ?? waitTime;
  const approachTime = totalJourney - borderWait;

  return (
    <div
      className={`bg-surface border rounded-[var(--radius-lg)] overflow-hidden ${
        isRecommended ? "border-cruze-green/30" : "border-border"
      } ${onClick || onToggleExpand ? "cursor-pointer hover:bg-surface-elevated transition-colors" : ""}`}
    >
      {/* Header with name, location, and actions */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-ink text-xl font-bold truncate">{crossingName}</h3>
            <p className="text-faint text-sm mt-1">
              {mexicanCity}, MX ↔ {usCity}, US
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {showBookmark && onToggleFavorite && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className="w-9 h-9 flex items-center justify-center rounded-full active:bg-surface-elevated transition-colors"
                aria-label="Bookmark"
              >
                {isFavorited ? (
                  <BookmarkCheck className="w-5 h-5 text-cruze-green" />
                ) : (
                  <Bookmark className="w-5 h-5 text-ink" />
                )}
              </button>
            )}
            {onShare && (
              <button
                onClick={(e) => { e.stopPropagation(); onShare(); }}
                className="w-9 h-9 flex items-center justify-center rounded-full active:bg-surface-elevated transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5 text-ink" />
              </button>
            )}
          </div>
        </div>

        {/* Live Status */}
        {showLiveStatus && generatedAt && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cruze-green" />
            <span className="text-cruze-green text-xs font-semibold uppercase tracking-wider">
              {t("common.live")}
            </span>
            <span className="text-faint text-xs">
              {t("shared.updatedMinAgo", {
                minutes: Math.floor(
                  (Date.now() - new Date(generatedAt).getTime()) / 60000
                ),
              })}
            </span>
          </div>
        )}

        {/* Journey Metrics */}
        <div className="flex gap-0">
          {/* Border Wait */}
          <div className="flex items-center gap-3 p-3 bg-surface-raised rounded-[var(--radius-md)] flex-1 min-w-0">
            <Clock className="w-5 h-5 text-faint shrink-0" />
            <div className="min-w-0">
              <span className="text-ink text-xl font-bold tabular truncate">
                {formatDuration(waitTime)}
              </span>
              <p className="text-faint text-xs mt-0.5">{t("crossings.borderWait")}</p>
              {/* Selected Lane Chip */}
              {selectedLane && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cruze-green/10 border border-cruze-green/20 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-cruze-green" />
                    <span className="text-cruze-green text-[10px] font-medium">
                      {selectedLane.name}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Total Journey */}
          {totalJourneyTime !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-surface-raised rounded-[var(--radius-md)] flex-1 min-w-0 border-l border-border">
              <TrendingUp className="w-5 h-5 text-faint shrink-0" />
              <div className="min-w-0">
                <span className="text-ink text-xl font-bold tabular truncate">
                  {formatDuration(totalJourneyTime)}
                </span>
                <p className="text-faint text-xs mt-0.5">{t("crossings.totalJourney")}</p>
                {approachTime > 0 && (
                  <p className="text-faint text-[10px] mt-0.5">
                    ≈ {formatDuration(approachTime)} approach + {formatDuration(waitTime)} border
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="w-px bg-border mx-2" />
        </div>
      </div>

      {/* Expand/Collapse Chevron */}
      {(onToggleExpand || lanes.length > 0) && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleExpand?.(); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-left border-t border-border bg-surface-elevated/30 hover:bg-surface-elevated/50 transition-colors"
          disabled={!onToggleExpand && lanes.length === 0}
        >
          <span className="text-faint text-xs font-medium uppercase tracking-wider">
            {isExpanded ? t("crossings.collapseLanes") : t("crossings.expandLanes")}
          </span>
          <ChevronDown className={`w-4 h-4 text-faint transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
          {/* Status chip + Wait time + Total journey */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorSoft(status)}`}
              >
                {getStatusText(status, t)}
              </span>
            </div>

            {/* Border wait */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-faint" />
              <span className="text-ink text-xl font-bold tabular">
                {formatDuration(waitTime)}
              </span>
            </div>
            <span className="text-faint text-xs">{t("crossings.borderWait")}</span>

            <div className="w-px h-6 bg-border" />

            {/* Total journey */}
            {totalJourneyTime !== undefined && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-faint" />
                <span className="text-ink text-xl font-bold tabular">
                  {formatDuration(totalJourneyTime)}
                </span>
              </div>
            )}
            {totalJourneyTime !== undefined && (
              <span className="text-faint text-xs">{t("crossings.totalJourney")}</span>
            )}
          </div>

          {/* Lane Eligibility & Times */}
          {lanes.length > 0 && (
            <div className="space-y-3">
              <p className="text-muted text-xs font-medium uppercase tracking-wider">
                {t("crossings.laneTimes")}
              </p>
              <div className="space-y-2">
                {(() => {
                  // Sort: Standard first, then by direction (MX_TO_US first), then by wait time
                  const lanesToShow = [...lanes].sort((a, b) => {
                    const aIsStandard = a.program === "STANDARD";
                    const bIsStandard = b.program === "STANDARD";
                    if (aIsStandard !== bIsStandard) return aIsStandard ? -1 : 1;
                    if (a.direction !== b.direction) return a.direction === "MX_TO_US" ? -1 : 1;
                    return a.waitTime - b.waitTime;
                  });

                  const visibleLanes = lanesToShow.slice(0, 5);
                  const remainingCount = lanesToShow.length - 5;

                  return (
                    <>
                      {visibleLanes.map((lane) => (
                        <button
                          key={`${lane.direction}-${lane.program}-${lane.name}`}
                          onClick={() => onSelectLane?.(lane)}
                          className={`w-full flex items-center gap-3 p-3 bg-surface-elevated rounded-[var(--radius-md)] text-left transition-colors ${
                            selectedLane?.program === lane.program && selectedLane?.direction === lane.direction
                              ? "border border-cruze-green/30 bg-cruze-green/5"
                              : "hover:bg-surface-subtle"
                          }`}
                        >
                          {/* Lane indicator */}
                          <div className="flex items-center gap-2 shrink-0">
                            {lane.program === "STANDARD" && (
                              <Car className="w-4 h-4 text-faint" />
                            )}
                            {lane.program === "READY_LANE" && (
                              <Navigation className="w-4 h-4 text-cruze-green" />
                            )}
                            {lane.program === "SENTRI" && (
                              <Shield className="w-4 h-4 text-cruze-amber" />
                            )}
                            {lane.program === "PEDESTRIAN" && (
                              <User className="w-4 h-4 text-faint" />
                            )}
                            {lane.program === "COMMERCIAL" && (
                              <Truck className="w-4 h-4 text-faint" />
                            )}
                            {(!["STANDARD", "READY_LANE", "SENTRI", "PEDESTRIAN", "COMMERCIAL"].includes(lane.program)) && (
                              <CircleAlert className="w-4 h-4 text-faint" />
                            )}
                            <span className="text-ink text-sm font-medium">
                              {lane.name}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0" />
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-ink text-lg font-bold tabular">
                              {formatDuration(lane.waitTime)}
                            </span>
                            <span className="text-faint text-xs">min</span>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              lane.isOpen ? "bg-improving" : "bg-critical"
                            }`} />
                          </div>
                        </button>
                      ))}
                      {remainingCount > 0 && (
                        <button className="w-full flex items-center justify-center gap-2 p-3 bg-surface-elevated rounded-[var(--radius-md)] text-left hover:bg-surface-subtle transition-colors">
                          <Info className="w-4 h-4 text-faint" />
                          <span className="text-muted text-sm font-medium">
                            +{remainingCount} {t("crossings.moreLanes")}
                          </span>
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Freshness */}
          {generatedAt && (
            <p className="text-faint text-xs">
              {t("shared.updatedMinAgo", {
                minutes: Math.floor(
                  (Date.now() - new Date(generatedAt).getTime()) / 60000
                ),
              })}
            </p>
          )}

          {/* Delta for alternatives */}
          {deltaMinutes !== undefined && deltaMinutes > 0 && (
            <p className="text-faint text-xs">
              +{deltaMinutes} {t("common.min")} {t("crossings.vsRecommended")}
            </p>
          )}

          {/* CTA when clickable but not recommended */}
          {onClick && !isRecommended && onToggleExpand && (
            <button
              onClick={onClick}
              className="w-full h-[40px] flex items-center justify-center gap-2 bg-surface-elevated border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium active:bg-surface-subtle transition-colors"
            >
              {t("crossings.selectCrossing")}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};