import { describe, it, expect } from "vitest";
import { generateResponse } from "../agent-templates";
import type { MergedCrossingData } from "../border-data-service";
import type { AgentLiveContext } from "../agent-context";
import type { CrossingFreshness } from "../live-crossing/types";
import type { TravelerProfile } from "@/types";

/** t mock returns the key plus serialized values so tests assert key usage. */
function makeT() {
  return (key: string, values?: Record<string, any>): string =>
    values ? `${key}|${JSON.stringify(values)}` : key;
}

function makeCrossing(overrides: Partial<MergedCrossingData> = {}): MergedCrossingData {
  return {
    id: "san-ysidro",
    name: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5431, lng: -117.0379 },
    waitTimeNorthbound: 30,
    waitTimeSouthbound: 21,
    statusNorthbound: "OPEN",
    statusSouthbound: "OPEN",
    lanesNorthbound: [
      { name: "Standard", waitTime: 30, isOpen: true },
      { name: "SENTRI", waitTime: 10, isOpen: true },
    ],
    lanesSouthbound: [],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    hours: "24/7",
    ...overrides,
  } as MergedCrossingData;
}

function makeLiveContext(overrides: Partial<AgentLiveContext> = {}): AgentLiveContext {
  return {
    origin: null,
    destination: null,
    direction: null,
    travelMode: null,
    selectedCrossingId: null,
    selectedCrossingName: null,
    crossingStatus: null,
    crossingWaitTime: null,
    crossingFreshness: null,
    unreadAvisoCount: 0,
    latestAviso: null,
    hasActiveTrip: false,
    hasLiveCrossingData: false,
    ...overrides,
  };
}

function baseCtx(overrides: Record<string, any> = {}) {
  return {
    crossing: null,
    allCrossings: [makeCrossing()],
    trip: { completed: false, start: null, destination: null },
    profile: null,
    liveContext: makeLiveContext(),
    t: makeT(),
    ...overrides,
  };
}

describe("generateResponse — direction", () => {
  it("uses crossing data when no live context", () => {
    const res = generateResponse("direction", baseCtx({ crossing: makeCrossing() }));
    expect(res.text).toContain("agent.template.directionAt");
    expect(res.text).toContain("San Ysidro");
    expect(res.cards).toHaveLength(1);
    expect(res.cards![0].value).toContain("30");
    expect(res.action?.href).toBe("/crossing/san-ysidro");
    expect(res.suggestions).toHaveLength(3);
  });

  it("prefers live context wait/name over stale crossing data", () => {
    const live = makeLiveContext({
      hasActiveTrip: true,
      hasLiveCrossingData: true,
      selectedCrossingName: "Otay Mesa",
      crossingStatus: "limited",
      crossingWaitTime: 55,
      crossingFreshness: "live" as CrossingFreshness,
    });
    const res = generateResponse(
      "direction",
      baseCtx({ crossing: makeCrossing(), liveContext: live })
    );
    expect(res.text).toContain("Otay Mesa");
    expect(res.text).toContain("55");
    expect(res.cards![0].status).toBe("limited");
  });

  it("maps live closed status to closed card", () => {
    const live = makeLiveContext({
      hasActiveTrip: true,
      hasLiveCrossingData: true,
      selectedCrossingName: "Otay Mesa",
      crossingStatus: "closed",
      crossingWaitTime: 0,
      crossingFreshness: "live" as CrossingFreshness,
    });
    const res = generateResponse("direction", baseCtx({ liveContext: live }));
    expect(res.cards![0].status).toBe("closed");
  });

  it("resolves a real fallback gate (tappable) when crossings known", () => {
    const res = generateResponse("direction", baseCtx());
    expect(res.text).toContain("agent.template.noCurrentCrossing");
    expect(res.cards![0].id).toBe("san-ysidro");
    expect(res.cards![0].subtitle).toContain("San Ysidro");
    expect(res.action?.href).toBe("/crossing/san-ysidro");
    expect(res.suggestions).toHaveLength(2);
  });

  it("falls back to a dead label only with zero crossings", () => {
    const res = generateResponse("direction", baseCtx({ allCrossings: [] }));
    expect(res.text).toContain("agent.template.noCurrentCrossing");
    expect(res.cards![0].value).toContain("agent.template.mostCommonCrossing");
    expect(res.cards![0].id).toBeUndefined();
    expect(res.action?.href).toBe("/crossings");
  });

  it("status without crossing lists fastest gates as tappable cards", () => {
    const res = generateResponse("status", baseCtx());
    expect(res.text).toContain("agent.template.allOperating");
    expect(res.cards).toHaveLength(1);
    expect(res.cards![0].id).toBe("san-ysidro");
    expect(res.action?.href).toBe("/crossings");
  });

  it("lane and compare cards carry crossing ids", () => {
    const wait = generateResponse("wait_times", baseCtx({ crossing: makeCrossing() }));
    expect(wait.cards!.every((c) => c.id === "san-ysidro")).toBe(true);
    const compare = generateResponse("compare", baseCtx());
    expect(compare.cards!.every((c) => c.id === "san-ysidro")).toBe(true);
  });
});

describe("generateResponse — general", () => {
  it("references trip when completed", () => {
    const trip = {
      completed: true,
      start: { name: "Tijuana" },
      destination: { name: "San Diego" },
    };
    const res = generateResponse("general", baseCtx({ trip }));
    expect(res.text).toContain("agent.template.generalWithTrip");
    expect(res.text).toContain("Tijuana");
    expect(res.suggestions).toContain("agent.suggest.waitTimes");
  });

  it("returns generic help without trip", () => {
    const res = generateResponse("general", baseCtx());
    expect(res.text).toContain("agent.template.generalHelp");
    expect(res.suggestions).toContain("agent.suggest.configureTrip");
  });

  it("appends live context note when trip is live", () => {
    const trip = {
      completed: true,
      start: { name: "Tijuana" },
      destination: { name: "San Diego" },
    };
    const live = makeLiveContext({
      hasActiveTrip: true,
      hasLiveCrossingData: true,
      selectedCrossingName: "San Ysidro",
      crossingStatus: "open",
      crossingWaitTime: 25,
      crossingFreshness: "live" as CrossingFreshness,
    });
    const res = generateResponse("general", baseCtx({ trip, liveContext: live }));
    expect(res.text).toContain("agent.template.liveContextNote");
  });
});

describe("generateResponse — greeting with live context", () => {
  it("adds proactive greeting when trip is live", () => {
    const trip = {
      completed: true,
      start: { name: "Tijuana" },
      destination: { name: "San Diego" },
    };
    const live = makeLiveContext({
      hasActiveTrip: true,
      hasLiveCrossingData: true,
      selectedCrossingName: "San Ysidro",
      crossingStatus: "open",
      crossingWaitTime: 25,
      crossingFreshness: "live" as CrossingFreshness,
    });
    const res = generateResponse("greeting", baseCtx({ trip, liveContext: live }));
    expect(res.text).toContain("agent.template.greetingWithTrip");
    expect(res.text).toContain("agent.template.proactiveGreeting");
  });

  it("omits proactive greeting without live data", () => {
    const res = generateResponse("greeting", baseCtx());
    expect(res.text).toContain("agent.template.greetingGeneric");
    expect(res.text).not.toContain("proactiveGreeting");
  });
});

describe("generateResponse — whatshappening with live context", () => {
  it("appends freshness indicator when live data present", () => {
    const live = makeLiveContext({
      hasLiveCrossingData: true,
      crossingFreshness: "live" as CrossingFreshness,
    });
    const res = generateResponse("whatshappening", baseCtx({ liveContext: live }));
    expect(res.text).toContain("agent.template.liveDataFreshness");
    expect(res.suggestions).toHaveLength(3);
  });
});

describe("generateResponse — conversation history", () => {
  const history = [
    { role: "user" as const, text: "wait times?" },
    { role: "assistant" as const, text: "here are wait times" },
  ];

  it("greets returning users with the compact welcome-back", () => {
    const res = generateResponse("greeting", baseCtx({ history }));
    expect(res.text).toContain("agent.template.greetingBack");
    expect(res.text).not.toContain("agent.template.greetingGeneric");
    expect(res.suggestions).toContain("agent.suggest.tripHelp");
  });

  it("greets first-time users generically without history", () => {
    const res = generateResponse("greeting", baseCtx());
    expect(res.text).toContain("agent.template.greetingGeneric");
  });

  it("prefixes general responses with follow-up context when history exists", () => {
    const res = generateResponse("general", baseCtx({ history }));
    expect(res.text).toContain("agent.template.followUpContext");
    expect(res.text).toContain("agent.template.generalHelp");
  });

  it("leaves general responses untouched without history", () => {
    const res = generateResponse("general", baseCtx());
    expect(res.text).not.toContain("agent.template.followUpContext");
  });
});

describe("generateResponse — suggestions coverage", () => {
  it("wait_times includes compare/directions suggestions", () => {
    const res = generateResponse("wait_times", baseCtx({ crossing: makeCrossing() }));
    expect(res.suggestions).toContain("agent.suggest.compare");
    expect(res.suggestions).toContain("agent.suggest.directions");
  });

  it("documents suggests sentri info and rules", () => {
    const res = generateResponse("documents", baseCtx());
    expect(res.text).toContain("agent.template.documentsNeed");
    expect(res.checklist!.length).toBeGreaterThan(0);
    expect(res.suggestions).toContain("agent.suggest.sentryInfo");
    expect(res.suggestions).toContain("agent.suggest.rules");
  });

  it("rules suggests documents", () => {
    const res = generateResponse("rules", baseCtx());
    expect(res.checklist).toHaveLength(6);
    expect(res.suggestions).toContain("agent.suggest.documents");
  });

  it("status includes wait times suggestion", () => {
    const res = generateResponse("status", baseCtx({ crossing: makeCrossing() }));
    expect(res.text).toContain("agent.template.statusAt");
    expect(res.suggestions).toContain("agent.suggest.waitTimes");
  });

  it("sentri holder gets sentri lanes data", () => {
    const profile: TravelerProfile = {
      crossingMode: "personal_vehicle",
      accessType: "sentri",
      documentCategory: "passport",
      trustedTraveler: "sentri",
    };
    const res = generateResponse("sentry", baseCtx({ profile }));
    expect(res.text).toContain("agent.template.sentriHas");
    expect(res.suggestions).toContain("agent.suggest.waitTimes");
  });

  it("unknown intent falls back to default help with 4 suggestions", () => {
    const res = generateResponse("nonexistent" as any, baseCtx());
    expect(res.text).toContain("agent.template.defaultHelp");
    expect(res.suggestions).toHaveLength(4);
  });
});
