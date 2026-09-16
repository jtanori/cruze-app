"use client";

import { useTranslations } from "next-intl";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsFavorites } from "@/components/settings/SettingsFavorites";
import { useFavoritesStore } from "@/stores/favorites";

export default function SettingsFavoritesPage() {
  const t = useTranslations();
  const crossingIds = useFavoritesStore((s) => s.crossingIds);
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={t("settings.pages.favoritesTitle")} />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsFavorites favorites={crossingIds.map((id: string) => ({ id, name: id }))} />
      </div>
    </div>
  );
}
