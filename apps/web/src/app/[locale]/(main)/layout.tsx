"use client";

import { AppShell } from "@/components/layout/AppShell";
import { LocationPermissionPrompt } from "@/components/location/LocationPermissionPrompt";
import { LocationAcquisitionState } from "@/components/location/LocationAcquisitionState";
import { LocationRecoveryPanel } from "@/components/location/LocationRecoveryPanel";
import { Spinner } from "@/components/primitives/Spinner";
import { useLocationContext } from "@/components/location/LocationProvider";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";

function getHeaderVariant(pathname: string): "root" | "search" | "filter" {
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  if (path.startsWith("/crossings")) return "root";
  if (path.startsWith("/trip")) return "root";
  if (path.startsWith("/agent")) return "root";
  return "root";
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const { start, destination } = useTripStore();
  const { status, reason } = useLocationContext();

  const headerVariant = getHeaderVariant(pathname ?? "");
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

  // AppShell chrome always renders; only <main> content switches on
  // location status. Loading until the location hook resolves (isLoading),
  // error surface from the hook, children on success.
  const content = (() => {
    switch (status) {
      case "loading":
        return (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        );
      case "prompt":
        return <LocationPermissionPrompt />;
      case "acquiring":
        return <LocationAcquisitionState />;
      case "error":
        return <LocationRecoveryPanel reason={reason} />;
      case "ready":
        return <>{children}</>;
    }
  })();

  return (
    <AppShell
      headerVariant={headerVariant}
      tripActions={tripActions}
    >
      {content}
    </AppShell>
  );
}
