"use client";

import { AppShell } from "@/components/layout/AppShell";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { useTranslations } from "next-intl";
import { CrossingsFilterProvider, CrossingsFilterTabs } from "@/components/crossing/CrossingsFilterContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

function getHeaderVariant(pathname: string): "root" | "search" | "filter" {
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  if (path.startsWith("/crossings")) return "search";
  if (path.startsWith("/viaje")) return "root";
  if (path.startsWith("/favorites")) return "root";
  if (path.startsWith("/agent")) return "root";
  if (path.startsWith("/alerts")) return "root";
  return "root";
}

function getActiveTab(pathname: string): "viaje" | "crossings" | "agent" | "favorites" | "alerts" {
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  if (path.startsWith("/viaje")) return "viaje";
  if (path.startsWith("/crossings")) return "crossings";
  if (path.startsWith("/agent")) return "agent";
  if (path.startsWith("/favorites")) return "favorites";
  if (path.startsWith("/alerts")) return "alerts";
  return "crossings";
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const { start, destination, recommendedCrossing } = useTripStore();
  const t = useTranslations();

  const headerVariant = getHeaderVariant(pathname);
  const activeTab = getActiveTab(pathname);
  const hasTrip = start !== null && destination !== null;
  const isCrossingsPage = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/").startsWith("/crossings");

  const tripActions = hasTrip ? {
    onEndTrip: () => {
      useTripStore.getState().reset();
    },
    onConfigure: () => {
      window.location.href = `/${locale}/viaje/configure`;
    },
    onNavigate: () => {
      const rec = useTripStore.getState().recommendedCrossing;
      if (rec) {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${rec.coordinates.lat},${rec.coordinates.lng}`,
          "_blank"
        );
      }
    },
    onViewCrossing: () => {
      const rec = useTripStore.getState().recommendedCrossing;
      if (rec) {
        window.location.href = `/${locale}/crossing/${rec.crossingId}`;
      }
    },
  } : undefined;

  // For crossings page, search is the header companion
  // Filter tabs will be rendered in the page content (not in header)
  const headerCompanion = isCrossingsPage ? undefined : undefined;

  return (
    <AppShell
      headerVariant={headerVariant}
      tripActions={tripActions}
      headerCompanion={headerCompanion}
    >
      {children}
    </AppShell>
  );
}