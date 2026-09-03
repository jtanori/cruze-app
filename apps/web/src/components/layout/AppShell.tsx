"use client";

import { TopAppBar } from "./TopAppBar";
import { BottomNavigation } from "./BottomNavigation";
import type { BottomNavDestination, HeaderVariant } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";

interface TripActions {
  onEndTrip: () => void;
  onConfigure: () => void;
  onNavigate: () => void;
  onViewCrossing: () => void;
}

interface AppShellProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
  headerTitle?: string;
  hideBottomNav?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  hasSearch?: boolean;
  tripActions?: TripActions;
  bottomCompanion?: React.ReactNode;
  headerCompanion?: React.ReactNode;
}

function pathToDestination(pathname: string): BottomNavDestination {
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  if (path.startsWith("/viaje")) return "viaje";
  if (path.startsWith("/favorites")) return "favorites";
  if (path.startsWith("/agent")) return "agent";
  if (path.startsWith("/alerts")) return "alerts";
  return "crossings";
}

export function AppShell({
  children,
  headerVariant = "root",
  headerTitle,
  hideBottomNav = false,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  hasSearch = false,
  tripActions,
  bottomCompanion,
  headerCompanion,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathToDestination(pathname);
  const locale = useLocale();

  const handleNavigate = (dest: BottomNavDestination) => {
    if (dest === "viaje") router.push(`/${locale}/viaje`);
    else if (dest === "crossings") router.push(`/${locale}/crossings`);
    else if (dest === "agent") router.push(`/${locale}/agent`);
    else if (dest === "favorites") router.push(`/${locale}/favorites`);
    else if (dest === "alerts") router.push(`/${locale}/alerts`);
  };

  return (
    <div className="min-h-dvh bg-background">
      <TopAppBar
        variant={headerVariant}
        title={headerTitle}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        tripActions={tripActions}
      />

      {headerCompanion && (
        <div className="fixed top-[var(--nav-header-height)] left-0 right-0 z-[var(--z-header)] bg-background border-b border-border-subtle">
          {headerCompanion}
        </div>
      )}

      <main
        className="pt-[var(--nav-header-height)]"
        style={{
          paddingTop: hasSearch
            ? "calc(var(--nav-header-height) + 80px)"
            : headerCompanion
            ? "calc(var(--nav-header-height) + 48px)"
            : "var(--nav-header-height)",
          paddingBottom: "calc(var(--nav-bottom-height) + env(safe-area-inset-bottom) + 24px)",
        }}
      >
        {children}
      </main>

      {bottomCompanion && (
        <div className="fixed bottom-[var(--nav-bottom-height)] left-0 right-0 z-[var(--z-overlay)]">
          {bottomCompanion}
        </div>
      )}

      {!hideBottomNav && (
        <BottomNavigation active={active} onSelect={handleNavigate} />
      )}
    </div>
  );
}