"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { useFavoritesStore } from "@/stores/favorites";

interface CrossingFavoriteButtonProps {
  crossingId: string;
  className?: string;
}

export function CrossingFavoriteButton({ crossingId, className = "" }: CrossingFavoriteButtonProps) {
  const t = useTranslations();
  const isFavorite = useFavoritesStore((s) => s.crossingIds.includes(crossingId));
  const addFavorite = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  const toggle = () => {
    if (isFavorite) {
      removeFavorite(crossingId);
    } else {
      addFavorite(crossingId);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t("crossings.favorite.remove") : t("crossings.favorite.add")}
      className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${className}`}
    >
      <Star
        className={`w-6 h-6 transition-colors ${
          isFavorite ? "fill-cruze-mint text-cruze-mint" : "text-muted"
        }`}
      />
    </button>
  );
}
