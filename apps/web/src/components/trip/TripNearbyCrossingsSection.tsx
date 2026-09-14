"use client";

import { useTranslations } from "next-intl";

interface TripNearbyCrossingsSectionProps {
  children: React.ReactNode;
  onViewAll: () => void;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  showViewAllAtBottom?: boolean;
}

export function TripNearbyCrossingsSection({
  children,
  onViewAll,
  loading = false,
  empty = false,
  emptyMessage,
  showViewAllAtBottom = false,
}: TripNearbyCrossingsSectionProps) {
  const t = useTranslations();

  if (empty) {
    return (
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-ink font-semibold text-sm uppercase tracking-wider">
              {t("trip.empty.nearby")}
            </h2>
            <p className="text-faint text-xs">
              {t("trip.empty.nearbySubtitle")}
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="text-cruze-mint text-sm font-medium hover:underline shrink-0"
          >
            {t("trip.empty.viewAll")}
          </button>
        </div>
        <div className="text-center py-6">
          <p className="text-muted text-sm">
            {emptyMessage || t("trip.empty.noNearby")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="space-y-0.5">
        <h2 className="text-[18px] font-semibold uppercase tracking-wider text-[color:var(--color-text-primary)]">
          {t("trip.empty.nearby")}
        </h2>
        <p className="text-xs text-faint">
          {t("trip.empty.nearbySubtitle")}
        </p>
      </div>

      {loading ? (
        <div className="space-y-2" role="status" aria-label={t("common.loading")}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface-elevated rounded-[var(--radius-md)] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-2">{children}</div>
          <button
            onClick={onViewAll}
            className={`w-full text-center text-cruze-mint text-sm font-medium hover:underline py-2 ${
              showViewAllAtBottom ? "mt-4" : ""
            }`}
          >
            {t("trip.empty.viewAll")}
          </button>
        </>
      )}
    </section>
  );
}