"use client";
import { SettingsFavorites } from "@/components/settings/SettingsFavorites";
import { useFavoritesStore } from "@/stores/favorites";
export default function SettingsFavoritesPage() {
  const crossingIds = useFavoritesStore((s) => s.crossingIds);
  return <div className="px-5 py-6 max-w-lg mx-auto"><SettingsFavorites favorites={crossingIds.map((id: string) => ({ id, name: id }))} /></div>;
}
