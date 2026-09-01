/**
 * Monetization Types
 * Foundation scaffolding for future monetization features.
 * All features are disabled by default via feature flags.
 */

// ─── Ad Types ───
export type AdType = "display" | "interstitial" | "native" | "partner_card";

export interface AdPlacement {
  id: string;
  type: AdType;
  location: "crossing_detail" | "alerts_feed" | "agent_chat" | "summary_page";
  frequency: "always" | "session_once" | "daily";
}

// ─── Intent Bands (for ad relevance) ───
export type IntentBand =
  | "navigation"
  | "information"
  | "comparison"
  | "transaction"
  | "crisis";

// ─── Break System ───
export interface BreakState {
  active: boolean;
  startedAt: string | null;
  reason: "user_request" | "geofence" | "timeout" | null;
  expiresAt: string | null;
}

// ─── Contribution System ───
export type ContributableSignal =
  | "crossing_used"
  | "wait_sample"
  | "lane_status"
  | "queue_position"
  | "coarse_location"
  | "travel_time";

export interface ContributionSettings {
  enabled: boolean;
  signals: ContributableSignal[];
  lastContributedAt: string | null;
}

// ─── Consent ───
export type ConsentType = "data_contribution" | "personalized_ads" | "analytics";

export interface ConsentRecord {
  type: ConsentType;
  granted: boolean;
  timestamp: string;
  version: string;
}

// ─── Pro Tier ───
export type ProFeature =
  | "advanced_analytics"
  | "route_optimization"
  | "priority_alerts"
  | "ad_free"
  | "export_data";

export interface ProState {
  active: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
  features: ProFeature[];
}

// ─── Analytics Events ───
export type MonetizationEvent =
  | "ad_impression"
  | "ad_click"
  | "ad_dismiss"
  | "break_started"
  | "break_ended"
  | "contribution_started"
  | "contribution_sample"
  | "pro_upsell_shown"
  | "pro_upsell_clicked"
  | "consent_granted"
  | "consent_revoked";

export interface MonetizationEventPayload {
  event: MonetizationEvent;
  timestamp: string;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, string | number | boolean>;
}

// ─── Feature Flags ───
export interface FeatureFlags {
  ads_enabled: boolean;
  break_enabled: boolean;
  contribution_enabled: boolean;
  pro_enabled: boolean;
  partner_cards_enabled: boolean;
  native_ads_enabled: boolean;
  interstitial_ads_enabled: boolean;
}

// ─── Policy Config ───
export interface MonetizationPolicy {
  break: {
    maxDurationMinutes: number;
    cooldownMinutes: number;
    geofenceRadiusKm: number;
  };
  contribution: {
    minSamplesForAdLight: number;
    decayHours: number;
  };
  ads: {
    maxPerSession: number;
    minIntervalMinutes: number;
    crisisSuppressAll: boolean;
  };
  pro: {
    priceUSD: number;
    features: ProFeature[];
  };
}
