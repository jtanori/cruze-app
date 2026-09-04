"use client";

import { LocationGate } from "@/components/location/LocationGate";

interface RootGateProps {
  children: React.ReactNode;
}

/**
 * Root-level location gate that wraps all pages.
 * Excludes public routes: settings, crossing detail, test-index.
 */
export function RootGate({ children }: RootGateProps) {
  return <LocationGate>{children}</LocationGate>;
}