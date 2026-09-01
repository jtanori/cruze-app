"use client";

import { TopAppBar } from "./TopAppBar";
import { BottomNavigation } from "./BottomNavigation";
import type { BottomNavDestination, HeaderVariant } from "@/types";
import { usePathname, useRouter } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
  headerTitle?: string;
  hideBottomNav?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  hasSearch?: boolean;
}

function pathToDestination(pathname: string): BottomNavDestination {
  // Strip locale prefix (e.g., /es/agent → /agent)
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
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathToDestination(pathname);

  // Extract locale from pathname (e.g., /es/crossings → es)
  const locale = pathname.split("/")[1] || "es";

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
      />

      <main
        className="pt-[var(--nav-header-height)]"
        style={{
          paddingTop: hasSearch
            ? "calc(var(--nav-header-height) + 80px)"
            : "var(--nav-header-height)",
          paddingBottom: hideBottomNav
            ? "0"
            : "calc(var(--nav-bottom-height) + env(safe-area-inset-bottom) + 24px)",
        }}
      >
        {children}
      </main>

      {!hideBottomNav && (
        <BottomNavigation active={active} onSelect={handleNavigate} />
      )}
    </div>
  );
}
