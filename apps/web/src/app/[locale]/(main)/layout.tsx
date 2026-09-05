"use client";

import { AppShell } from "@/components/layout/AppShell";
import { LocationGate } from "@/components/location/LocationGate";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { useTranslations } from "next-intl";

interface MainLayoutProps {
  children: React.ReactNode;
}

function getHeaderVariant(pathname: string): "root" | "search" | "filter" {
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  if (path.startsWith("/crossings")) return "root";
  if (path.startsWith("/trip")) return "root";
  if (path.startsWith("/agent")) return "root";
  return "root";
}

function getActiveTab(pathname: string): "trip" | "crossings" | "agent" {
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  if (path.startsWith("/trip")) return "trip";
  if (path.startsWith("/agent")) return "agent";
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

  const tripActions = hasTrip ? {
    onEndTrip: () => {
      useTripStore.getState().reset();
    },
    onConfigure: () => {
      window.location.href = `/${locale}/trip/configure`;
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

  return (
    <LocationGate>
      <AppShell
        headerVariant={headerVariant}
        tripActions={tripActions}
      >
        {children}
      </AppShell>
    </LocationGate>
  );
}