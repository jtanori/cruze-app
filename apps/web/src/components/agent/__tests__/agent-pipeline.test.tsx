import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { AgentProvider, useAgent } from "../AgentProvider";
import { useTripStore } from "@/stores/trip";
import { useLiveCrossingStore } from "@/stores/live-crossing";
import { useAvisosStore } from "@/stores/avisos";
import { useAgentStore } from "@/stores/agent";
import { classifyIntent } from "@/lib/intent-classifier";
import { getAgentContext } from "@/lib/agent-context";
import { generateResponse, type ResponseContent } from "@/lib/agent-templates";
import type { MergedCrossingData } from "@/lib/border-data-service";
import enMessages from "@/i18n/messages/en.json";

function makeCrossing(): MergedCrossingData {
  return {
    id: "san-ysidro",
    name: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. de las Américas s/n, Tijuana, B.C.",
    usAddress: "7450 Camino de la Plaza, San Ysidro, CA 92173",
    country: "US",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5431, lng: -117.0379 },
    waitTimeNorthbound: 45,
    waitTimeSouthbound: 20,
    statusNorthbound: "OPEN",
    statusSouthbound: "OPEN",
    lanesNorthbound: [],
    lanesSouthbound: [],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    hours: "24/7",
  } as MergedCrossingData;
}

function seedLiveTrip() {
  useTripStore.getState().setStart({ name: "Tijuana" } as any);
  useTripStore.getState().setDestination({ name: "San Diego" } as any);
  useTripStore.getState().setSelectedCrossing({
    crossingId: "san-ysidro",
    crossingName: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    waitTime: 45,
    totalJourneyTime: 75,
    status: "open",
    isLive: true,
    generatedAt: new Date().toISOString(),
    coordinates: { lat: 32.5431, lng: -117.0379 },
  });
  useLiveCrossingStore.getState().setSnapshot(makeCrossing(), "north", 75);
  useAvisosStore.getState().addAviso({
    id: "a1",
    type: "crossing_changed",
    severity: "warning",
    title: "Wait surge",
    description: "Wait rose to 45 min",
    crossingId: "san-ysidro",
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
  });
}

function Harness({
  message,
  onDone,
}: {
  message: string;
  onDone: (r: ResponseContent) => void;
}) {
  const { processMessage } = useAgent();
  useEffect(() => {
    processMessage(message).then(onDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

describe("agent pipeline — pure function chain", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
    useLiveCrossingStore.getState().clear();
    useAvisosStore.getState().reset();
    seedLiveTrip();
  });

  it("classify → context → template yields live-enriched direction response", () => {
    expect(classifyIntent("directions please")).toBe("direction");

    const liveContext = getAgentContext();
    expect(liveContext.hasActiveTrip).toBe(true);
    expect(liveContext.hasLiveCrossingData).toBe(true);
    expect(liveContext.crossingWaitTime).toBe(45);
    expect(liveContext.selectedCrossingName).toBe("San Ysidro");
    expect(liveContext.unreadAvisoCount).toBe(1);

    const t = ((key: string, values?: Record<string, any>) =>
      values ? `${key}|${JSON.stringify(values)}` : key) as any;
    const res = generateResponse("direction", {
      crossing: null,
      allCrossings: [],
      trip: { completed: true, start: { name: "Tijuana" }, destination: { name: "San Diego" } },
      profile: null,
      liveContext,
      t,
    });
    expect(res.text).toContain("agent.template.directionAt");
    expect(res.text).toContain("45");
    expect(res.suggestions?.length).toBeGreaterThan(0);
  });

  it("greeting carries proactive live status for active trips", () => {
    const liveContext = getAgentContext();
    const t = ((key: string) => key) as any;
    const res = generateResponse("greeting", {
      crossing: null,
      allCrossings: [],
      trip: { completed: true, start: { name: "Tijuana" }, destination: { name: "San Diego" } },
      profile: null,
      liveContext,
      t,
    });
    expect(res.text).toContain("agent.template.proactiveGreeting");
  });
});

describe("agent pipeline — provider message persistence", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
    useLiveCrossingStore.getState().clear();
    useAvisosStore.getState().reset();
    useAgentStore.getState().clearHistory();
    seedLiveTrip();
    // Provider's crossings fetch resolves empty — deterministic fallback to live context
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ crossings: [] }) }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores exactly one user + one assistant message with richContent", async () => {
    let response: ResponseContent | null = null;
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <AgentProvider>
          <Harness message="directions please" onDone={(r) => (response = r)} />
        </AgentProvider>
      </NextIntlClientProvider>
    );

    await waitFor(() => expect(useAgentStore.getState().messages).toHaveLength(2));

    const messages = useAgentStore.getState().messages;
    // Regression lock: user message must appear exactly once (dup-send fix)
    expect(messages.filter((m) => m.role === "user")).toHaveLength(1);
    expect(messages.filter((m) => m.role === "assistant")).toHaveLength(1);
    expect(messages[0].content).toBe("directions please");

    const assistant = messages[1];
    expect(assistant.richContent).toBeDefined();
    expect(assistant.richContent!.suggestions?.length).toBeGreaterThan(0);
    expect(response).not.toBeNull();
    expect(response!.text).toContain("45");
  });
});
