/**
 * Feature Flags
 * Controls visibility of monetization features.
 * All flags default to false (Day-0: invisible scaffolding).
 */

import type { FeatureFlags } from "@/types/monetization";

const STORAGE_KEY = "cruze-feature-flags";

const DEFAULT_FLAGS: FeatureFlags = {
  ads_enabled: false,
  break_enabled: false,
  contribution_enabled: false,
  pro_enabled: false,
  partner_cards_enabled: false,
  native_ads_enabled: false,
  interstitial_ads_enabled: false,
};

let cachedFlags: FeatureFlags | null = null;

function loadFlags(): FeatureFlags {
  if (typeof window === "undefined") return { ...DEFAULT_FLAGS };

  if (cachedFlags) return cachedFlags;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      cachedFlags = { ...DEFAULT_FLAGS, ...parsed };
      return cachedFlags as FeatureFlags;
    }
  } catch {
    // Invalid data
  }

  cachedFlags = { ...DEFAULT_FLAGS };
  return cachedFlags as FeatureFlags;
}

function saveFlags(flags: FeatureFlags): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    cachedFlags = flags;
  } catch {
    // Storage full
  }
}

/**
 * Check if a feature flag is enabled.
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  const flags = loadFlags();
  return flags[flag] ?? false;
}

/**
 * Get all feature flags.
 */
export function getFeatureFlags(): FeatureFlags {
  return loadFlags();
}

/**
 * Set a feature flag (admin/development use).
 */
export function setFeatureFlag(flag: keyof FeatureFlags, enabled: boolean): void {
  const flags = loadFlags();
  flags[flag] = enabled;
  saveFlags(flags);
}

/**
 * Reset all flags to defaults.
 */
export function resetFeatureFlags(): void {
  saveFlags({ ...DEFAULT_FLAGS });
}

/**
 * Check if any ads are enabled.
 */
export function areAnyAdsEnabled(): boolean {
  const flags = loadFlags();
  return (
    flags.ads_enabled ||
    flags.native_ads_enabled ||
    flags.interstitial_ads_enabled ||
    flags.partner_cards_enabled
  );
}
