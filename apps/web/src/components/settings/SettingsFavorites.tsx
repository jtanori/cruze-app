"use client";

import { EmptyState } from "@/components/primitives/EmptyState";
import { Star } from "lucide-react";

interface FavoriteCrossing {
  id: string;
  name: string;
}

interface SettingsFavoritesProps {
  favorites: FavoriteCrossing[];
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function SettingsFavorites({ favorites, onSelect, onRemove }: SettingsFavoritesProps) {
  if (favorites.length === 0) {
    return <EmptyState title="Sin favoritos" description="Guarda cruces para acceso rápido." />;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-ink">Favoritos</h2>
      <div className="space-y-2">
        {favorites.map((f) => (
          <div key={f.id} className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-[var(--radius-lg)]">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <button onClick={() => onSelect?.(f.id)} className="flex-1 text-left text-sm text-ink">{f.name}</button>
            {onRemove && <button onClick={() => onRemove(f.id)} className="text-xs text-muted hover:text-danger">Quitar</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
