"use client";

import { useTranslations } from "next-intl";
import { User, Star, Map, Share2, Info } from "lucide-react";

interface SettingsItem {
  id: string;
  labelKey: string;
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
  const t = useTranslations();
  const sections: { titleKey: string; items: SettingsItem[] }[] = [
    { titleKey: "settings.root.perfilSection", items: [{ id: "profile", labelKey: "settings.root.perfilRow", icon: User, onClick: onProfile }] },
    { titleKey: "settings.root.guardadosSection", items: [{ id: "favorites", labelKey: "settings.root.favoritesRow", icon: Star, onClick: onFavorites }, { id: "myTrips", labelKey: "settings.root.myTripsRow", icon: Map, onClick: onMyTrips }] },
    { titleKey: "settings.root.privacidadSection", items: [{ id: "dataSharing", labelKey: "settings.root.dataSharingRow", icon: Share2, onClick: onDataSharing }] },
    { titleKey: "settings.root.infoSection", items: [{ id: "about", labelKey: "settings.root.aboutRow", icon: Info, onClick: onAbout }] },
  ];

  return (
    // No h1 here: the hosting page's CruzeBackHeader already titles the screen.
    <div className="space-y-4 sm:space-y-6">
      {sections.map((s) => (
        <div key={s.titleKey} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t(s.titleKey)}</p>
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
            {s.items.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-surface-elevated transition-colors">
                  <Icon className="w-5 h-5 text-muted" />
                  <span className="text-sm text-ink">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
