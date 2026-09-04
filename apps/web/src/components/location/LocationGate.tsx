"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocationStore } from "@/stores/location";
import { checkGeolocationPermission, requestGeolocation } from "@/lib/geolocation";
import { createLocationData } from "@/lib/location-state-machine";
import { LocationPermissionPrompt } from "./LocationPermissionPrompt";
import { LocationAcquisitionState } from "./LocationAcquisitionState";
import { LocationRecoveryPanel } from "./LocationRecoveryPanel";
import { Spinner } from "@/components/primitives/Spinner";

interface LocationGateProps {
  children: ReactNode;
}

/**
 * Infrastructure-level location gate that renders inline.
 * Blocks protected routes until location is established (GPS or manual).
 * Renders L01/L02/L03 directly — no redirects.
 */
export function LocationGate({ children }: LocationGateProps) {
  const pathname = usePathname();
  const { state, location, setState } = useLocationStore();
  const [initialized, setInitialized] = useState(false);

  // Public routes that don't require location
  const isPublicRoute = pathname
    ? pathname.startsWith("/settings") ||
      pathname.startsWith("/crossing/") ||
      pathname.startsWith("/test-index") ||
      pathname.startsWith("/onboarding/")
    : false;

  useEffect(() => {
    console.log("[Cruze:LocationGate] Mount — state:", state, "location:", location ? `${location.lat.toFixed(4)},${location.lng.toFixed(4)}` : "null", "public:", isPublicRoute);

    // Skip gate for public routes
    if (isPublicRoute) {
      console.log("[Cruze:LocationGate] Public route → pass through");
      setInitialized(true);
      return;
    }

    // If already has location data, skip
    if (location) {
      console.log("[Cruze:LocationGate] Location already set → pass through");
      setInitialized(true);
      return;
    }

    async function initLocation() {
      try {
        console.log("[Cruze:LocationGate] Checking geolocation permission...");
        const permissionState = await checkGeolocationPermission();
        console.log("[Cruze:LocationGate] Permission state:", permissionState);

        if (permissionState === "granted") {
          console.log("[Cruze:LocationGate] Permission granted → acquiring GPS...");
          setState("acquiring");
          try {
            const result = await requestGeolocation();
            console.log("[Cruze:LocationGate] GPS acquired:", result.lat.toFixed(4), result.lng.toFixed(4), "accuracy:", result.accuracy);
            const locationData = createLocationData(result.lat, result.lng, result.accuracy);
            useLocationStore.getState().setLocation(locationData);
            setState("ready");
            console.log("[Cruze:LocationGate] State → ready, opening gate");
            setInitialized(true);
          } catch (gpsError) {
            console.warn("[Cruze:LocationGate] GPS acquisition failed:", gpsError);
            setState("unavailable");
          }
        } else if (permissionState === "denied") {
          console.log("[Cruze:LocationGate] Permission denied → showing recovery panel");
          setState("permission_denied");
        } else {
          console.log("[Cruze:LocationGate] Permission not determined → showing prompt");
          setState("requesting_permission");
        }
      } catch (permError) {
        console.error("[Cruze:LocationGate] Error checking permission:", permError);
        setState("requesting_permission");
      }
    }

    initLocation();
  }, [location, setState]);

  // Log renders
  console.log("[Cruze:LocationGate] Render — initialized:", initialized, "state:", state);

  // Gate: wait for permission check on first render
  if (!initialized && state === "uninitialized") {
    console.log("[Cruze:LocationGate] Rendering: spinner (waiting for permission check)");
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // L01 — Permission prompt
  if (state === "requesting_permission") {
    console.log("[Cruze:LocationGate] Rendering: LocationPermissionPrompt (L01)");
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
          <LocationPermissionPrompt />
        </div>
      </div>
    );
  }

  // L02 — Acquiring
  if (state === "acquiring") {
    console.log("[Cruze:LocationGate] Rendering: LocationAcquisitionState (L02)");
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
          <LocationAcquisitionState />
        </div>
      </div>
    );
  }

  // L03 — Recovery (permission denied, services disabled, GPS failed, stale, etc.)
  if (
    state === "permission_denied" ||
    state === "services_disabled" ||
    state === "low_confidence" ||
    state === "stale" ||
    state === "unavailable"
  ) {
    const reason = state === "low_confidence" || state === "stale"
      ? state
      : state === "permission_denied"
        ? "permission_denied"
        : state === "services_disabled"
          ? "services_disabled"
          : "unavailable";

    console.log("[Cruze:LocationGate] Rendering: LocationRecoveryPanel (L03) — reason:", reason);
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
          <LocationRecoveryPanel reason={reason} />
        </div>
      </div>
    );
  }

  // Ready or location set — render children
  console.log("[Cruze:LocationGate] Gate OPEN — rendering children");
  return <>{children}</>;
}
