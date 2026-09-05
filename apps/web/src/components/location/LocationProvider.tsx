"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocation, type UseLocationResult } from "@/hooks/useLocation";

const LocationContext = createContext<UseLocationResult | null>(null);

/**
 * Single location subscription for the whole app.
 * Mount once in [locale]/layout (client component under the server layout),
 * replacing RootGate + LocationGate. Route layouts consume via
 * useLocationContext() and decide blocking vs passthrough per route —
 * the provider itself never blocks rendering.
 */
export function LocationProvider({ children }: { children: ReactNode }) {
  const value = useLocation();
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext(): UseLocationResult {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used under <LocationProvider>");
  return ctx;
}
