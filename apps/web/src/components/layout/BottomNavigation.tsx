"use client";

import { Navigation, Compass, MessageCircle, Star, Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAlertsStore } from "@/stores/alerts";
import { useTripStore } from "@/stores/trip";
import type { BottomNavDestination } from "@/types";

interface BottomNavigationProps {
  active: BottomNavDestination;
  onSelect: (dest: BottomNavDestination) => void;
}

export function BottomNavigation({ active, onSelect }: BottomNavigationProps) {
  const t = useTranslations();
  const unreadCount = useAlertsStore((s) => s.unreadCount());
  const hasTrip = useTripStore((s) => !s.completed && s.destination !== null);

  const DESTINATIONS: Array<{
    id: BottomNavDestination;
    label: string;
    icon: typeof Compass;
    showDot?: boolean;
  }> = [
    { id: "viaje", label: t("nav.viaje"), icon: Navigation, showDot: hasTrip },
    { id: "crossings", label: t("nav.crossings"), icon: Compass },
    { id: "agent", label: t("nav.agent"), icon: MessageCircle },
    { id: "favorites", label: t("nav.favorites"), icon: Star },
    { id: "alerts", label: t("nav.alerts"), icon: Bell },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-bottom)] bg-surface-elevated border-t border-border"
      style={{ height: "var(--nav-bottom-height)" }}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="h-full flex items-stretch">
        {DESTINATIONS.map((dest) => {
          const isActive = dest.id === active;
          const Icon = dest.icon;
          const badge =
            dest.id === "alerts" && unreadCount > 0
              ? unreadCount > 9
                ? "9+"
                : String(unreadCount)
              : null;

          return (
            <button
              key={dest.id}
              onClick={() => onSelect(dest.id)}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              role="tab"
              aria-selected={isActive}
              aria-label={dest.label}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-cruze-green" />
              )}

              {/* Icon + badge */}
              <span className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-colors ${
                    isActive ? "text-cruze-green" : "text-faint"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-critical text-white text-xs font-semibold tabular leading-none">
                    {badge}
                  </span>
                )}
                {dest.showDot && !isActive && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-cruze-green" />
                )}
              </span>

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-cruze-green" : "text-muted"
                }`}
              >
                {dest.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safe area padding */}
      <div className="h-[env(safe-area-inset-bottom)] bg-surface-elevated" />
    </nav>
  );
}
