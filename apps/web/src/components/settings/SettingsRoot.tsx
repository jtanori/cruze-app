"use client";

import { User, Star, Map, Share2, Info } from "lucide-react";

interface SettingsItem {
  id: string;
  label: string;
  icon: typeof User;
  onClick?: () => void;
}

interface SettingsRootProps {
  onProfile?: () => void;
  onFavorites?: () => void;
  onMyTrips?: () => void;
  onDataSharing?: () => void;
  onAbout?: () => void;
}

export function SettingsRoot({ onProfile, onFavorites, onMyTrips, onDataSharing, onAbout }: SettingsRootProps) {
  const sections: { title: string; items: SettingsItem[] }[] = [
    { title: "PERFIL", items: [{ id: "profile", label: "Perfil", icon: User, onClick: onProfile }] },
    { title: "GUARDADOS", items: [{ id: "favorites", label: "Favoritos", icon: Star, onClick: onFavorites }, { id: "myTrips", label: "Mis viajes", icon: Map, onClick: onMyTrips }] },
    { title: "PRIVACIDAD", items: [{ id: "dataSharing", label: "Compartir datos", icon: Share2, onClick: onDataSharing }] },
    { title: "INFORMACI\u00D3N", items: [{ id: "about", label: "Acerca de Cruze", icon: Info, onClick: onAbout }] },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl font-bold text-ink">CONFIGURACI\u00D3N</h1>
      {sections.map((s) => (
        <div key={s.title} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{s.title}</p>
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
            {s.items.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-elevated transition-colors">
                  <Icon className="w-5 h-5 text-muted" />
                  <span className="text-sm text-ink">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
