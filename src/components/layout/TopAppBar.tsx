"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Menu, X, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HeaderVariant } from "@/types";

interface TopAppBarProps {
  variant?: HeaderVariant;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onMenuAction?: () => void;
  trailingIcon?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
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
}: TopAppBarProps) {
  const t = useTranslations();
  const [collapsed, setCollapsed] = useState(false);

  const handleScroll = useCallback(() => {
    setCollapsed(window.scrollY > 48);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
            <span className="text-ink font-bold text-sm tracking-wider uppercase">
              {t("common.cruze")}
            </span>
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
            (variant === "root" ? (
              <button
                onClick={onMenuAction}
                className="w-[44px] h-[44px] flex items-center justify-center -mr-2 rounded-[var(--radius-md)] active:bg-surface-elevated transition-colors"
                aria-label={t("common.menu")}
              >
                <Menu className="w-5 h-5 text-ink" />
              </button>
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
