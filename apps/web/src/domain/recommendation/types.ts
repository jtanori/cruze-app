import type {
  CrossingEntity,
  StartPlace,
  DestinationPlace,
  TravelerProfile,
  CorridorDirection,
} from "@/types";

export type { CrossingEntity, StartPlace, DestinationPlace, TravelerProfile, CorridorDirection };

export type RecommendationReason =
  | "fastest_overall"
  | "shortest_wait"
  | "best_for_sentry"
  | "best_for_pedestrians"
  | "best_for_commercial"
  | "only_open_option"
  | "lowest_total_time";

/**
 * Domain-layer recommendation type.
 *
 * This is the domain's internal representation, independent of the application-level
 * `TripRecommendation` / `SelectedCrossing` from `@/lib/recommendation/types`.
 *
 * Boundary mapping:
 *   TripRecommendation → CrossingRecommendation (domain, at persistence boundary)
 *   CrossingRecommendation (domain) → SelectedCrossing (at read boundary)
 */
export interface CrossingRecommendation {
  crossing: CrossingEntity;
  reasons: RecommendationReason[];
  totalTimeMinutes: number;
  borderWaitMinutes: number;
  approachTimeMinutes: number;
  comparison?: {
    deltaMinutes: number;
    comparedToCrossingId: string;
  };
  confidence: "high" | "medium" | "low";
}

export interface RecommendationInput {
  origin: StartPlace;
  destination: DestinationPlace;
  travelerProfile: TravelerProfile;
  direction?: CorridorDirection;
}