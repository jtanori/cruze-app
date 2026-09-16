"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * SPLASH-01 — full-bleed S00 composition (composition B: precomposed scene
 * artwork + brand overlay; no separate route layer, never recreated in CSS).
 *
 * Layers: midnight base → scene art (graceful gradient fallback while the
 * final webp lands) → brand lockup → tagline → quiet progress.
 */
export function SplashScene() {
  const t = useTranslations();
  const [sceneOk, setSceneOk] = useState(true);

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-midnight"
      role="img"
      aria-label="Cruze — Border Intelligence"
      data-testid="splash-scene"
    >
      {/* Base: midnight gradient so a missing scene file still reads as CRUZE. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 20%, #12305a 0%, #071A31 55%, #040d1d 100%)",
        }}
      />
      {sceneOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/splash/splash-scene.webp"
          alt=""
          aria-hidden="true"
          onError={() => setSceneOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Brand lockup, upper-left per spec (never vertically centered). */}
      <div className="absolute left-6 top-10 sm:left-10 sm:top-14 w-44 sm:w-60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo/cruze-logo.svg"
          alt="Cruze — Border Intelligence"
          className="h-auto w-full"
        />
      </div>

      {/* Tagline, lower-left. */}
      <div className="absolute bottom-24 left-6 sm:left-10 sm:bottom-28">
        <p className="text-ink text-xl sm:text-2xl font-semibold leading-snug">
          {t("splash.tagline1")}
          <br />
          {t("splash.tagline2")}
        </p>
      </div>

      {/* Quiet progress: indeterminate bar, no percentage, reduced-motion safe. */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div
          role="status"
          aria-label={t("splash.loading")}
          className="h-[2px] w-24 overflow-hidden rounded-full bg-ink/10"
        >
          <div className="h-full w-1/3 rounded-full bg-cruze-green/70 motion-safe:animate-[splash-drift_1.6s_ease-in-out_infinite] motion-reduce:animate-none" />
        </div>
      </div>

      <style>{`@keyframes splash-drift {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(300%); }
      }`}</style>
    </div>
  );
}
