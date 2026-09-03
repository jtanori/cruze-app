"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { checkGeolocationPermission } from "@/lib/geolocation";
import { useLocationStore } from "@/stores/location";

interface LocationPermissionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LocationPermissionGate({
  children,
  fallback,
}: LocationPermissionGateProps) {
  const { state, setState } = useLocationStore();

  useEffect(() => {
    checkGeolocationPermission().then((permissionState) => {
      if (permissionState === "granted") {
        setState("acquiring");
      } else if (permissionState === "denied") {
        setState("permission_denied");
      } else {
        setState("requesting_permission");
      }
    });
  }, [setState]);

  if (state === "ready") {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
