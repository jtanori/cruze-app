import type { Place, StartPlace, DestinationPlace, TripType, TripDirection } from "@/types";

export type { TripType, TripDirection };

export interface Trip {
  id: string;
  origin: StartPlace | null;
  destination: DestinationPlace | null;
  tripType: TripType;
  direction: TripDirection | null;
  status: "configuring" | "active" | "completed" | "cancelled";
  createdAt: string;
  lastEvaluatedAt: string | null;
  geolocationPermission: "pending" | "granted" | "denied";
  start: StartPlace | null;
  recommendedCrossing: import("@/domain/recommendation/types").CrossingRecommendation | null;
  travelerProfileLevel: "trip" | "mode" | "eligibility" | "docs";
}

export type TravelerProfileLevel = "trip" | "mode" | "eligibility" | "docs";