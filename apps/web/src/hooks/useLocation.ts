"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLocationStore } from "@/stores/location";
import { useGeolocationPermission } from "./useGeolocationPermission";
import { requestGeolocation } from "@/lib/geolocation";
import { reverseGeocode } from "@/lib/geocoding";
import { resolveUserCountry, type Country } from "@/lib/country-resolution";
import { createLocationData, type LocationData } from "@/lib/location-state-machine";

export type LocationStatus = "loading" | "prompt" | "acquiring" | "ready" | "error";

export type LocationReason =
  | "permission_denied"
  | "services_disabled"
  | "low_confidence"
  | "stale"
  | "unavailable";

export interface UseLocationResult {
  status: LocationStatus;
  /** Aggregated data on success — extend with trip/crossings later. */
  data: { location: LocationData } | null;
  location: LocationData | null;
  error: Error | null;
  reason: LocationReason;
  isLoading: boolean;
  request: () => void;
  retry: () => void;
  selectManual: (
    lat: number,
    lng: number,
    placeName?: string,
    country?: Country | null
  ) => void;
  enterManualSearch: () => void;
  markServicesDisabled: () => void;
}

/**
 * Dismissing the native browser prompt fires NO callback — the request just
 * hangs. Chrome auto-blocks geolocation after repeated dismissals, and the
 * Permissions API reports that as plain "denied", indistinguishable from an
 * explicit deny. So we detect dismissal by silence: if getCurrentPosition
 * neither resolves nor rejects within SILENCE_TIMEOUT_MS, the prompt was
 * ignored. The persisted count tells the recovery panel when to show the
 * "reset in Page Info" guidance.
 */
const SILENCE_TIMEOUT_MS = 15000;
const IGNORE_COUNT_KEY = "cruze-location-prompt-ignores";

function getPromptIgnoreCount(): number {
  try {
    return Number(localStorage.getItem(IGNORE_COUNT_KEY)) || 0;
  } catch {
    return 0;
  }
}

function bumpPromptIgnoreCount(): number {
  try {
    const next = getPromptIgnoreCount() + 1;
    localStorage.setItem(IGNORE_COUNT_KEY, String(next));
    return next;
  } catch {
    return 0;
  }
}

function storeStateToStatus(state: string, hasLocation: boolean): LocationStatus {
  if (hasLocation || state === "ready" || state === "manual_search") return "ready";
  switch (state) {
    case "uninitialized":
      return "loading";
    case "requesting_permission":
      return "prompt";
    case "acquiring":
      return "acquiring";
    case "permission_denied":
    case "services_disabled":
    case "unavailable":
    case "low_confidence":
    case "stale":
      return "error";
    default:
      return "loading";
  }
}

/**
 * Single aggregated location hook — the only place that subscribes to
 * permission + GPS. Pages/layouts consume this (via LocationProvider),
 * never the zustand store or lib/geolocation directly.
 */
export function useLocation(): UseLocationResult {
  const { state, location, error: storeError, setState, setLocation, setError } =
    useLocationStore();
  const { permission } = useGeolocationPermission();
  const acquiringRef = useRef(false);
  const initializedRef = useRef(false);
  const permissionRef = useRef(permission);

  useEffect(() => {
    permissionRef.current = permission;
  }, [permission]);

  const acquire = useCallback(async () => {
    if (acquiringRef.current) return;
    acquiringRef.current = true;
    setError(null);
    setState("acquiring");
    // Silence watchdog: a dismissed native prompt never settles.
    let settled = false;
    let watchdogFired = false;
    const watchdog = setTimeout(() => {
      if (settled) return;
      watchdogFired = true;
      bumpPromptIgnoreCount();
      setState("permission_denied");
      setError(
        "Location request timed out — the browser prompt may have been dismissed. Reset it in Page Info and try again."
      );
      acquiringRef.current = false;
    }, SILENCE_TIMEOUT_MS);
    try {
      const result = await requestGeolocation();
      settled = true;
      clearTimeout(watchdog);
      // Late success after a watchdog firing still wins (user eventually accepted).
      const place = await reverseGeocode(result.lat, result.lng).catch(() => null);
      const data = createLocationData(result.lat, result.lng, result.accuracy);
      // Keep the full place — country upgrades to HIGH when geocoded.
      const resolved = resolveUserCountry(place?.country ?? null);
      data.country = resolved.country;
      data.countryConfidence = resolved.confidence;
      data.placeName =
        place?.name ?? `${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`;
      if (place?.formattedAddress) data.formattedAddress = place.formattedAddress;
      if (place?.city) data.city = place.city;
      if (place?.region) data.region = place.region;
      setLocation(data, false);
      setState("ready");
    } catch (e) {
      settled = true;
      clearTimeout(watchdog);
      if (watchdogFired) return; // watchdog already surfaced this as permission_denied
      if (!acquiringRef.current) return;
      const err = e as GeolocationPositionError & Error;
      const code = (err as { code?: number })?.code;
      // TIMEOUT while permission is still "prompt" means no decision was made —
      // the user ignored the prompt rather than the GPS failing.
      const promptIgnored = code === 3 && permissionRef.current === "prompt";
      if (promptIgnored) bumpPromptIgnoreCount();
      if (code === 1 || promptIgnored) {
        setState("permission_denied");
        setError(promptIgnored ? "Location prompt dismissed" : "Location permission denied");
      } else {
        setState("unavailable");
        setError(err?.message ?? "Location unavailable");
      }
    } finally {
      clearTimeout(watchdog);
      acquiringRef.current = false;
    }
  }, [setError, setLocation, setState]);

  // Reset transient persisted state once per mount (keep cached location).
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (location) {
      if (state !== "ready") setState("ready");
      return;
    }
    if (
      state === "acquiring" ||
      state === "ready" ||
      state === "stale" ||
      state === "low_confidence"
    ) {
      setState("uninitialized");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map browser permission → store on load and on settings flips.
  useEffect(() => {
    if (location) return;
    if (permission === "granted") {
      if (state === "uninitialized" || state === "requesting_permission") {
        void acquire();
      } else if (
        state === "permission_denied" ||
        state === "unavailable" ||
        state === "services_disabled"
      ) {
        void acquire();
      }
    } else if (permission === "denied") {
      if (state === "uninitialized" || state === "requesting_permission") {
        setState("permission_denied");
      }
    } else {
      if (state === "uninitialized") setState("requesting_permission");
    }
  }, [permission, location, state, acquire, setState]);

  const request = useCallback(() => {
    void acquire();
  }, [acquire]);

  const retry = useCallback(() => {
    void acquire();
  }, [acquire]);

  const selectManual = useCallback(
    (
      lat: number,
      lng: number,
      placeName?: string,
      country?: Country | null
    ) => {
      const data = createLocationData(lat, lng, 1000);
      // Manual picks carry their geocoded country when the caller has it.
      const resolved = resolveUserCountry(country ?? null);
      data.country = resolved.country;
      data.countryConfidence = resolved.confidence;
      if (placeName) {
        data.placeName = placeName;
      }
      setError(null);
      setLocation(data, true);
      setState("ready");
    },
    [setError, setLocation, setState]
  );

  const enterManualSearch = useCallback(() => {
    setState("manual_search");
  }, [setState]);

  const markServicesDisabled = useCallback(() => {
    setState("services_disabled");
  }, [setState]);

  const hasLocation = location !== null;
  const status = storeStateToStatus(state, hasLocation);
  const reason: LocationReason =
    state === "permission_denied" ||
    state === "services_disabled" ||
    state === "low_confidence" ||
    state === "stale"
      ? state
      : "unavailable";

  return {
    status,
    data: hasLocation && location ? { location } : null,
    location,
    error: storeError ? new Error(storeError) : null,
    reason,
    isLoading: status === "loading" || status === "acquiring",
    request,
    retry,
    selectManual,
    enterManualSearch,
    markServicesDisabled,
  };
}
