"use client";

import { useState, useEffect } from "react";

export type GeolocationPermissionState = PermissionState | "prompt";

export interface GeolocationPermission {
  permission: GeolocationPermissionState;
  isSupported: boolean;
}

/**
 * Reactive geolocation permission — lifecycle-bound.
 * Query once, subscribe to "change" for browser settings flips.
 * Falls back to "prompt" when Permissions API unavailable.
 */
export function useGeolocationPermission(
  initial: GeolocationPermissionState = "prompt"
): GeolocationPermission {
  const [permission, setPermission] = useState<GeolocationPermissionState>(initial);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      setPermission("prompt");
      setIsSupported(
        typeof navigator !== "undefined" && !!navigator.geolocation
      );
      return;
    }
    setIsSupported(true);

    let status: PermissionStatus | null = null;
    let handler: (() => void) | null = null;
    let active = true;

    navigator.permissions
      .query({ name: "geolocation" } as PermissionDescriptor)
      .then((permissionStatus) => {
        if (!active) return;
        status = permissionStatus;
        setPermission(permissionStatus.state as GeolocationPermissionState);

        handler = () => {
          if (!active) return;
          setPermission(permissionStatus.state as GeolocationPermissionState);
        };

        if (typeof permissionStatus.addEventListener === "function") {
          permissionStatus.addEventListener("change", handler as EventListener);
        } else {
          (permissionStatus as unknown as { onchange: (() => void) | null }).onchange =
            handler;
        }
      })
      .catch(() => {
        if (active) setPermission("prompt");
      });

    return () => {
      active = false;
      if (status && handler) {
        try {
          if (typeof status.removeEventListener === "function") {
            status.removeEventListener("change", handler as EventListener);
          }
          const s = status as unknown as { onchange?: (() => void) | null };
          if (s.onchange === (handler as unknown as () => void)) s.onchange = null;
        } catch {}
      }
    };
  }, []);

  return { permission, isSupported };
}
