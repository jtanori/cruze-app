/**
 * Monetization Policy Configuration
 * Defines rules and thresholds for monetization features.
 * All values are conservative defaults for Day-0.
 */

import type { MonetizationPolicy, IntentBand } from "@/types/monetization";

export const MONETIZATION_POLICY: MonetizationPolicy = {
  break: {
    maxDurationMinutes: 240,    // 4 hours max break
    cooldownMinutes: 30,        // 30 min between breaks
    geofenceRadiusKm: 2,        // 2km radius around crossing
  },
  contribution: {
    minSamplesForAdLight: 3,    // Need 3+ contributions for ad-light
    decayHours: 24,             // Contribution effect decays after 24h
  },
  ads: {
    maxPerSession: 5,           // Max 5 ads per session
    minIntervalMinutes: 10,     // Min 10 min between ads
    crisisSuppressAll: true,    // No ads during crisis
  },
  pro: {
    priceUSD: 4.99,             // Monthly Pro price
    features: [
      "advanced_analytics",
      "route_optimization",
      "priority_alerts",
      "ad_free",
      "export_data",
    ],
  },
};

/**
 * Intent-to-ad relevance mapping.
 * Higher score = more relevant ad placement.
 */
export const INTENT_AD_RELEVANCE: Record<IntentBand, number> = {
  navigation: 0.8,      // High: user is actively traveling
  transaction: 0.9,     // Highest: user is about to spend
  information: 0.5,     // Medium: informational queries
  comparison: 0.6,      // Medium-high: considering options
  crisis: 0.0,          // Never: suppress during crisis
};

/**
 * Break end conditions.
 */
export const BREAK_END_CONDITIONS = {
  geofenceCrossed: true,      // End break when user crosses border
  timeout: true,              // End break after max duration
  manualEnd: true,            // User can end break manually
  tripCompleted: true,        // End break when trip completes
};

/**
 * Contribution signal weights for ad-light calculation.
 */
export const CONTRIBUTION_WEIGHTS: Record<string, number> = {
  crossing_used: 1.0,
  wait_sample: 0.8,
  lane_status: 0.6,
  queue_position: 0.5,
  coarse_location: 0.3,
  travel_time: 0.7,
};

/**
 * Check if ads should be suppressed based on context.
 */
export function shouldSuppressAds(context: {
  breakActive: boolean;
  contributionActive: boolean;
  crisisActive: boolean;
  isPro: boolean;
  adsThisSession: number;
  lastAdAt: string | null;
}): boolean {
  if (context.breakActive) return true;
  if (context.isPro) return true;
  if (context.crisisActive && MONETIZATION_POLICY.ads.crisisSuppressAll) return true;
  if (context.contributionActive) return true; // Ad-light = no ads for now
  if (context.adsThisSession >= MONETIZATION_POLICY.ads.maxPerSession) return true;

  if (context.lastAdAt) {
    const elapsed = Date.now() - new Date(context.lastAdAt).getTime();
    const minInterval = MONETIZATION_POLICY.ads.minIntervalMinutes * 60 * 1000;
    if (elapsed < minInterval) return true;
  }

  return false;
}

/**
 * Calculate contribution score for ad-light eligibility.
 */
export function calculateContributionScore(
  signals: Array<{ type: string; weight: number; timestamp: string }>
): number {
  const now = Date.now();
  let score = 0;

  for (const signal of signals) {
    const age = now - new Date(signal.timestamp).getTime();
    const decay = Math.max(0, 1 - age / (MONETIZATION_POLICY.contribution.decayHours * 3600 * 1000));
    score += signal.weight * decay;
  }

  return score;
}
