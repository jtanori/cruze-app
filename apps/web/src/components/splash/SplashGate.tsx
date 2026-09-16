"use client";

import { useEffect, useState } from "react";
import { SplashScene } from "./SplashScene";

/**
 * W0 entry gate: shows S00 for a minimum visual beat, then reveals the app.
 * Mounts once per page load (state persists across client navigations, so
 * the splash never replays in-session). No data fetching, no decisions —
 * entry resolution lands here in a later phase.
 */
const MIN_SPLASH_MS = 900;

export function SplashGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), MIN_SPLASH_MS);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return <SplashScene />;
  return <>{children}</>;
}
