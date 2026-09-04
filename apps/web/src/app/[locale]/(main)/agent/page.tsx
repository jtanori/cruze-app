"use client";

import { AgentProvider } from "@/components/agent/AgentProvider";
import { AgentChat } from "@/components/agent/AgentChat";

export default function AgentPage() {
  return (
    <AgentProvider>
      <AgentChat />
    </AgentProvider>
  );
}
