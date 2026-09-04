"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { Star } from "lucide-react";
import { useFavoritesStore } from "@/stores/favorites";
import { getMergedCrossingsData, type MergedCrossingData } from "@/lib/border-data-service";

export default function FavoritesPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const { crossingIds, removeFavorite } = useFavoritesStore();
  const [crossings, setCrossings] = useState<MergedCrossingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCrossings() {
      setLoading(true);
      const data = await getMergedCrossingsData();
      setCrossings(data);
      setLoading(false);
    }
    loadCrossings();
  }, []);

  const favoriteCrossings = crossings.filter((c) => crossingIds.includes(c.id));

  const handleSelectCrossing = (crossingId: string) => {
    router.push(`/${locale}/crossing/${crossingId}`);
  };

  if (favoriteCrossings.length === 0) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-8 py-32">
        <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
          <Star className="w-7 h-7 text-faint" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-ink text-sm font-medium">{t("favorites.empty")}</p>
          <p className="text-muted text-xs leading-relaxed">
            {t("favorites.emptyDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-5 py-4 sm:py-6">
      <div>
        <p className="text-ink text-sm sm:text-base font-semibold">{t("nav.favorites")}</p>
        <p className="text-faint text-xs mt-1">
          {favoriteCrossings.length}{" "}
          {favoriteCrossings.length !== 1
            ? t("favorites.savedCrossings")
            : t("favorites.savedCrossing")}
        </p>
      </div>

      <div className="space-y-0">
        {favoriteCrossings.map((crossing, i) => (
          <div key={crossing.id}>
            <button
              onClick={() => handleSelectCrossing(crossing.id)}
              className="w-full flex items-center justify-between py-4 text-left active:bg-surface-subtle transition-colors"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-ink text-sm font-semibold">
                    {crossing.name}
                  </span>
                  <span className="text-faint text-xs">
                    {crossing.mexicanCity} → {crossing.usCity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      crossing.statusNorthbound === "OPEN"
                        ? "bg-improving"
                        : crossing.statusNorthbound === "LIMITED"
                        ? "bg-caution"
                        : "bg-critical"
                    }`}
                  />
                  <span className="text-faint text-xs">{crossing.statusNorthbound}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-ink text-lg sm:text-xl font-semibold tabular leading-none">
                  {crossing.waitTimeNorthbound}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(crossing.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full active:bg-surface-elevated transition-colors"
                  aria-label={`Remove ${crossing.name} from favorites`}
                >
                  <Star className="w-4 h-4 text-caution fill-caution" />
                </span>
              </div>
            </button>
            {i < favoriteCrossings.length - 1 && (
              <div className="h-px bg-border-subtle" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}