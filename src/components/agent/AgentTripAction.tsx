"use client";

import { Navigation, Eye, GitCompare, Settings, Flag } from "lucide-react";
import type { AgentTripAction as AgentTripActionType } from "@/lib/agent-structured-results";

const icons = {
  navigate: Navigation,
  viewCrossing: Eye,
  compare: GitCompare,
  configure: Settings,
  complete: Flag,
};

interface Props {
  result: AgentTripActionType;
  onAction: () => void;
}

export function AgentTripAction({ result, onAction }: Props) {
  const Icon = icons[result.action] ?? Navigation;
  const isPrimary = result.action === "navigate";

  return (
    <button
      onClick={onAction}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        isPrimary ? "bg-cruze-mint text-midnight border-cruze-mint" : "bg-surface border-border text-ink hover:bg-surface-elevated"
      }`}
    >
      <Icon className="w-4 h-4" /> {result.label}
    </button>
  );
}
