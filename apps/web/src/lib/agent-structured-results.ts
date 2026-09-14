export type AgentResultType =
  | "crossing"
  | "recommendation"
  | "tripAction"
  | "checklist";

export interface AgentCrossingResult {
  type: "crossing";
  crossingId: string;
  crossingName: string;
  waitTime: number | null;
  totalJourney?: number | null;
  status: string;
}

export interface AgentRecommendationResult {
  type: "recommendation";
  crossingName: string;
  waitTime: number;
  totalJourney: number;
  reasons: string[];
}

export interface AgentTripAction {
  type: "tripAction";
  action: "navigate" | "viewCrossing" | "compare" | "configure" | "complete";
  label: string;
}

export interface AgentChecklistResult {
  type: "checklist";
  items: { label: string; status: "checked" | "unchecked" | "warning"; detail?: string }[];
}

export type AgentStructuredResult =
  | AgentCrossingResult
  | AgentRecommendationResult
  | AgentTripAction
  | AgentChecklistResult;

export function getAgentContext(): Record<string, unknown> {
  // Re-export from agent-context.ts for backward compatibility
  // This stub is replaced by the real implementation in agent-context.ts
  return {};
}
