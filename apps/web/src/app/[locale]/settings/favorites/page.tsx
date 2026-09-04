"use client";
import { SettingsFavorites } from "@/components/settings/SettingsFavorites";
import { useFavoritesStore } from "@/stores/favorites";
export default function SettingsFavoritesPage() {
  const crossingIds = useFavoritesStore((s) => s.crossingIds);
  return <div className="px-4 sm:px-5 py-4 sm:py-6 max-w-md lg:max-w-xl xl:max-w-2xl mx-auto"><SettingsFavorites favorites={crossingIds.map((id: string) => ({ id, name: id }))} /></div>;
}
