/* ─── Lane Programs ─────────────────────────────────────────────────────────*/

export type LaneProgram =
  | "STANDARD"
  | "READY_LANE"
  | "SENTRI"
  | "PEDESTRIAN"
  | "COMMERCIAL";

/* ─── Crossing Entity (subset for CrossingCard) ─────────────────────────────*/

export interface Lane {
  program: LaneProgram;
  waitTime: number;
  isOpen: boolean;
  lanesOpenCount?: number;
  totalLanesCount?: number;
  trend?: "improving" | "stable" | "worsening";
}

/* ─── Restrictions ───────────────────────────────────────────────────────────*/

export interface Restrictions {
  commercialAllowed: boolean;
  pedestrianAllowed: boolean;
  specialNotices?: string[];
}