/**
 * Geofence Monitor
 * Tracks user position and detects border crossing events.
 * Uses background geolocation with fallback to foreground timer.
 */

import type { TripDirection } from "@/types";

const GEOFENCE_RADIUS_KM = 2;
const BORDER_PROXIMITY_KM = 0.5;
const POSITION_CHECK_INTERVAL_MS = 30_000; // 30 seconds

interface Position {
  lat: number;
  lng: number;
}

interface GeofenceCallbacks {
  onPositionUpdate: (lat: number, lng: number) => void;
  onBorderCrossed: () => void;
  onApproaching: () => void;
  onError: (error: string) => void;
}

let watchId: number | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Calculate haversine distance between two points in km.
 */
export function haversineDistance(a: Position, b: Position): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

/**
 * Check if user has crossed the border based on position and direction.
 */
export function checkBorderCrossed(
  userPosition: Position,
  crossingPosition: Position,
  direction: TripDirection
): boolean {
  const distance = haversineDistance(userPosition, crossingPosition);
  if (distance > GEOFENCE_RADIUS_KM) return false;

  // Check directional movement
  if (direction === "MX_TO_US") {
    return userPosition.lat > crossingPosition.lat - 0.01;
  } else {
    return userPosition.lat < crossingPosition.lat + 0.01;
  }
}

/**
 * Check if user is approaching the crossing.
 */
export function checkApproaching(
  userPosition: Position,
  crossingPosition: Position
): boolean {
  const distance = haversineDistance(userPosition, crossingPosition);
  return distance <= GEOFENCE_RADIUS_KM && distance > BORDER_PROXIMITY_KM;
}

/**
 * Check if user is at the crossing booth.
 */
export function checkAtBooth(
  userPosition: Position,
  crossingPosition: Position
): boolean {
  const distance = haversineDistance(userPosition, crossingPosition);
  return distance <= BORDER_PROXIMITY_KM;
}

/**
 * Start watching user position.
 * Uses Geolocation API with fallback to polling.
 */
export function startGeofenceMonitor(
  crossingPosition: Position,
  direction: TripDirection,
  callbacks: GeofenceCallbacks
): void {
  stopGeofenceMonitor();

  if ("geolocation" in navigator) {
    // Try background geolocation first
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        callbacks.onPositionUpdate(latitude, longitude);

        const userPos = { lat: latitude, lng: longitude };

        if (checkBorderCrossed(userPos, crossingPosition, direction)) {
          callbacks.onBorderCrossed();
        } else if (checkApproaching(userPos, crossingPosition)) {
          callbacks.onApproaching();
        }
      },
      (error) => {
        // Fallback to foreground polling
        startForegroundPolling(crossingPosition, direction, callbacks);
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 5_000,
      }
    );
  } else {
    startForegroundPolling(crossingPosition, direction, callbacks);
  }
}

/**
 * Foreground polling fallback.
 * Checks position at regular intervals when app is in foreground.
 */
function startForegroundPolling(
  crossingPosition: Position,
  direction: TripDirection,
  callbacks: GeofenceCallbacks
): void {
  intervalId = setInterval(() => {
    if (!("geolocation" in navigator)) {
      callbacks.onError("Geolocation not available");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        callbacks.onPositionUpdate(latitude, longitude);

        const userPos = { lat: latitude, lng: longitude };

        if (checkBorderCrossed(userPos, crossingPosition, direction)) {
          callbacks.onBorderCrossed();
        } else if (checkApproaching(userPos, crossingPosition)) {
          callbacks.onApproaching();
        }
      },
      (error) => {
        callbacks.onError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5_000,
        maximumAge: 10_000,
      }
    );
  }, POSITION_CHECK_INTERVAL_MS);
}

/**
 * Stop watching user position.
 */
export function stopGeofenceMonitor(): void {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Check if geolocation permission is granted.
 */
export async function checkGeolocationPermission(): Promise<PermissionState> {
  if (!("geolocation" in navigator)) {
    return "denied";
  }

  if ("permissions" in navigator) {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      return result.state;
    } catch {
      return "prompt";
    }
  }

  return "prompt";
}

/**
 * Request geolocation permission.
 */
export async function requestGeolocationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 5_000 }
    );
  });
}
