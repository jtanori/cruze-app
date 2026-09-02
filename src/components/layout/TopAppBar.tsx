"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, X, Search, MoreHorizontal, MapPin, Settings, Navigation, LogOut } from "lucide-react";
import { useAlertsStore } from "@/stores/alerts";
import { useTripStore } from "@/stores/trip";
import { useLocale } from "@/hooks/use-locale";
import type { HeaderVariant } from "@/types";

interface TripActions {
  onEndTrip: () => void;
  onConfigure: () => void;
  onNavigate: () => void;
  onViewCrossing: () => void;
}

interface TopAppBarProps {
  variant?: HeaderVariant;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onMenuAction?: () => void;
  trailingIcon?: React.ReactNode;
  themeToggle?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  tripActions?: TripActions;
}

export function TopAppBar({
  variant = "root",
  title,
  onBack,
  onMenuAction,
  trailingIcon,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  tripActions,
}: TopAppBarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    setCollapsed(window.scrollY > 48);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Country display for header
  const [userCountry, setUserCountry] = useState<"MX" | "US" | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCountry(pos.coords.longitude < -100 ? "MX" : "US");
        },
        () => setUserCountry("US")
      );
    } else {
      setUserCountry("US");
    }
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const height = collapsed ? "var(--nav-header-compact-height)" : "var(--nav-header-height)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[var(--z-header)] bg-background border-b border-border-subtle transition-all duration-[180ms]"
      style={{ height }}
    >
      <div className="h-full flex items-center justify-between px-5">
        {/* Leading */}
        <div className="min-w-[44px] flex items-center justify-start">
          {variant === "root" ? (
            <div className="flex items-center gap-2">
              <span className="text-ink font-bold text-sm tracking-wider uppercase">
                {t("common.cruze")}
              </span>
              <span className="text-[10px] font-medium tabular text-faint">
                {userCountry === "MX" ? "MX" : "USA"}
              </span>
            </div>
          ) : onBack ? (
            <button
              onClick={onBack}
              className="w-[44px] h-[44px] flex items-center justify-center -ml-2 rounded-[var(--radius-md)] active:bg-surface-elevated transition-colors"
              aria-label={t("common.back")}
            >
              <ArrowLeft className="w-5 h-5 text-ink" />
            </button>
          ) : variant === "search" || variant === "filter" ? (
            <button
              onClick={onMenuAction}
              className="w-[44px] h-[44px] flex items-center justify-center -ml-2 rounded-[var(--radius-md)] active:bg-surface-elevated transition-colors"
              aria-label={t("common.close")}
            >
              <X className="w-5 h-5 text-ink" />
            </button>
          ) : null}
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {title && (
            <span className="text-ink font-semibold text-[11px] uppercase tracking-wider truncate max-w-[200px]">
              {title}
            </span>
          )}
          {variant === "root" && !title && (
            <div className="flex items-center gap-1.5">
              <span className="text-cruze-green text-[10px] font-semibold tabular">
                ● {t("common.live")}
              </span>
            </div>
          )}
        </div>

        {/* Trailing */}
        <div className="min-w-[44px] flex items-center justify-end">
          {trailingIcon ??
            (variant === "root" && tripActions ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-[44px] h-[44px] flex items-center justify-center rounded-[var(--radius-md)] active:bg-surface-elevated transition-colors"
                  aria-label={t("common.menu")}
                >
                  <MoreHorizontal className={`w-5 h-5 text-ink transition-transform ${menuOpen ? "rotate-90" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-[var(--radius-lg)] shadow-lg overflow-hidden z-[var(--z-overlay)]">
                    <button
                      onClick={() => { tripActions.onEndTrip(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-ink hover:bg-surface-elevated transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-faint" />
                      {t("viaje.endTrip")}
                    </button>
                    <button
                      onClick={() => { tripActions.onConfigure(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-ink hover:bg-surface-elevated transition-colors"
                    >
                      <Settings className="w-4 h-4 text-faint" />
                      {t("viaje.configure")}
                    </button>
                    <button
                      onClick={() => { tripActions.onNavigate(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-ink hover:bg-surface-elevated transition-colors"
                    >
                      <Navigation className="w-4 h-4 text-faint" />
                      {t("viaje.navigate")}
                    </button>
                    <button
                      onClick={() => { tripActions.onViewCrossing(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-ink hover:bg-surface-elevated transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-faint" />
                      {t("viaje.viewCrossing")}
                    </button>
                  </div>
                )}
              </div>
            ) : variant === "root" ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium tabular text-faint">
                  {userCountry === "MX" ? "MX" : "USA"}
                </span>
              </div>
            ) : null)}
        </div>
      </div>

      {/* Search Bar (below header row) */}
      {onSearchChange && (
        <div className="absolute top-full left-0 right-0 px-5 py-3 bg-background border-b border-border-subtle">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || t("crossings.searchPlaceholder")}
              className="w-full h-[40px] pl-10 pr-10 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-green transition-colors"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-faint" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
