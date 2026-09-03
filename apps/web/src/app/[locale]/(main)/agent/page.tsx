"use client";

import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";
import { AgentProvider } from "@/components/agent/AgentProvider";
import { AgentChat } from "@/components/agent/AgentChat";

export default function AgentPage() {
  const t = useTranslations();

  return (
    <AppShell headerVariant="root" headerTitle={t("agent.title")}>
      <AgentProvider>
        <AgentChat />
      </AgentProvider>
    </AppShell>
  );
}