"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useTripStore } from "@/stores/trip";
import { useTravelerStore } from "@/stores/traveler";
import { useAgentStore } from "@/stores/agent";
import { getMergedCrossingsData, type MergedCrossingData } from "@/lib/border-data-service";
import { classifyIntent, extractCrossingMention, type IntentBand } from "@/lib/intent-classifier";
import { generateResponse, type ResponseContent } from "@/lib/agent-templates";
import { BORDER_CROSSINGS } from "@/lib/border-data";
import { useTranslations, useLocale } from "next-intl";

interface AgentContextValue {
  crossings: MergedCrossingData[];
  loading: boolean;
  processMessage: (message: string) => Promise<ResponseContent>;
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [crossings, setCrossings] = useState<MergedCrossingData[]>([]);
  const [loading, setLoading] = useState(true);

  const trip = useTripStore();
  const { profile } = useTravelerStore();
  const { addMessage } = useAgentStore();
  const t = useTranslations();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getMergedCrossingsData();
      setCrossings(data);
      setLoading(false);
    }
    load();
  }, []);

  const processMessage = useCallback(
    async (message: string): Promise<ResponseContent> => {
      // Classify intent
      const intent: IntentBand = classifyIntent(message);

      // Extract crossing mention
      const crossingId = extractCrossingMention(message, BORDER_CROSSINGS);
      const crossing = crossingId
        ? crossings.find((c) => c.id === crossingId) || null
        : null;

      // Generate response via i18n t (no hardcoded isEn)
      const response = generateResponse(intent, {
        crossing,
        allCrossings: crossings,
        trip,
        profile,
        t: (key: string, values?: Record<string, any>) => {
          try {
            return t(key as any, values as any);
          } catch {
            return key;
          }
        },
      });

      // Save to agent store
      addMessage("user", message);
      addMessage("assistant", response.text);

      return response;
    },
    [crossings, trip, profile, addMessage]
  );

  return (
    <AgentContext.Provider value={{ crossings, loading, processMessage }}>
      {children}
    </AgentContext.Provider>
  );
}
