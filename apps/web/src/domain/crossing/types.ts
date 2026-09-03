import type {
  CorridorDirection,
  PortOperatingStatus,
  LaneProgram,
} from "@/types";

export type { CorridorDirection, PortOperatingStatus, LaneProgram };

export interface Lane {
  name: string;
  category: LaneProgram;
  waitTime: number;
  isOpen: boolean;
  lanesOpen?: number;
  totalLanes?: number;
  trend?: "improving" | "stable" | "worsening";
}

export interface CrossingRestrictions {
  commercialAllowed: boolean;
  pedestrianAllowed: boolean;
  specialNotices?: string[];
}

export interface CrossingHours {
  is24Hours: boolean;
  operatingHoursText: string;
}

export interface CrossingEntity {
  id: string;
  name: string;
  cityOrigin: string;
  cityDestination: string;
  direction: CorridorDirection;
  status: PortOperatingStatus;
  statusMessage?: string;
  is24Hours: boolean;
  operatingHoursText: string;
  lanes: Record<LaneProgram, Lane>;
  dominantWaitMinutes: number;
  typicalWaitMinutes: number;
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
  restrictions: CrossingRestrictions;
  historicalHourlyProfile?: Array<{
    hour: number;
    typicalWait: number;
    todayActualWait?: number;
  }>;
}