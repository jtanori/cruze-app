/**
 * Agent Response Templates — i18n via next-intl t()
 * All user-facing strings come from messages/{es,en}.json agent.template.* + agent.checklist.*
 * No hardcoded Spanish/English — caller must pass t from useTranslations().
 */

import type { IntentBand } from "./intent-classifier";
import type { MergedCrossingData } from "./border-data-service";
import type { TravelerProfile } from "@/types";
import type { AgentLiveContext } from "./agent-context";
import type { ConversationTurn } from "./agent-conversation";

interface TripContext {
  completed: boolean;
  start: { name: string } | null;
  destination: { name: string } | null;
}

export interface ResponseContent {
  text: string;
  cards?: ResponseCard[];
  checklist?: ResponseChecklistItem[];
  dataRows?: ResponseDataRow[];
  action?: ResponseAction;
  suggestions?: string[];
}

export interface ResponseCard {
  id?: string;
  title: string;
  subtitle?: string;
  value?: string;
  unit?: string;
  status?: "open" | "limited" | "closed" | "neutral";
  detail?: string;
}

export interface ResponseChecklistItem {
  label: string;
  checked: boolean;
  required: boolean;
}

export interface ResponseDataRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ResponseAction {
  label: string;
  href: string;
}

interface TemplateContext {
  crossing: MergedCrossingData | null;
  allCrossings: MergedCrossingData[];
  trip: TripContext;
  profile: TravelerProfile | null;
  liveContext?: AgentLiveContext;
  history?: ConversationTurn[];
  t: (key: string, values?: Record<string, any>) => string;
}

function getWaitStatus(wait: number): "open" | "limited" | "closed" {
  if (wait <= 30) return "open";
  if (wait <= 60) return "limited";
  return "closed";
}

function getDocumentChecklist(profile: TravelerProfile | null, t: (k: string, v?: any) => string): ResponseChecklistItem[] {
  const items: ResponseChecklistItem[] = [
    { label: t("agent.checklist.passport"), checked: true, required: true },
  ];
  if (profile?.documentCategory === "visa") {
    items.push({ label: t("agent.checklist.visa"), checked: true, required: true });
  }
  if (profile?.trustedTraveler === "sentri") {
    items.push({ label: t("agent.checklist.sentri"), checked: true, required: false });
  }
  items.push({ label: t("agent.checklist.vehicle"), checked: false, required: false });
  items.push({ label: t("agent.checklist.insurance"), checked: false, required: false });
  return items;
}

export function generateResponse(
  intent: IntentBand,
  ctx: TemplateContext
): ResponseContent {
  const { crossing, allCrossings, trip, profile, liveContext, history = [], t } = ctx;
  switch (intent) {
    case "wait_times":
      return generateWaitTimesResponse(crossing, allCrossings, t);
    case "hours":
      return generateHoursResponse(crossing, t);
    case "documents":
      return generateDocumentsResponse(profile, t);
    case "sentry":
      return generateSentriResponse(profile, t);
    case "compare":
      return generateCompareResponse(crossing, allCrossings, t);
    case "status":
      return generateStatusResponse(crossing, allCrossings, t);
    case "rules":
      return generateRulesResponse(t);
    case "greeting":
      return generateGreetingResponse(trip, t, liveContext, history);
    case "direction":
      return generateDirectionResponse(crossing, allCrossings, t, liveContext);
    case "general":
      return generateGeneralResponse(trip, profile, t, liveContext, history);
    case "whatshappening":
      return generateWhatsHappeningResponse(allCrossings, t, liveContext);
    default:
      return generateDefaultResponse(t);
  }
}

function generateWaitTimesResponse(
  crossing: MergedCrossingData | null,
  allCrossings: MergedCrossingData[],
  t: (k: string, v?: any) => string
): ResponseContent {
  if (crossing) {
    const lanes = crossing.lanesNorthbound.slice(0, 3);
    const cards: ResponseCard[] = lanes.map((lane) => ({
      id: crossing.id,
      title: lane.name,
      value: `${lane.waitTime}`,
      unit: t("common.min"),
      status: getWaitStatus(lane.waitTime),
      detail: lane.isOpen ? t("common.open") : t("common.closed"),
    }));
    return {
      text: t("agent.template.waitTimesAt", { name: crossing.name }),
      cards,
      action: {
        label: t("agent.template.viewCrossingDetails"),
        href: `/crossing/${crossing.id}`,
      },
      suggestions: [
        t("agent.suggest.compare"),
        t("agent.suggest.directions"),
        t("agent.suggest.whatsHappening"),
      ],
    };
  }
  const sorted = [...allCrossings].sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound).slice(0, 5);
  const dataRows: ResponseDataRow[] = sorted.map((c) => ({
    label: c.name,
    value: `${c.waitTimeNorthbound} ${t("common.min")}`,
    highlight: c.waitTimeNorthbound <= 20,
  }));
  return {
    text: t("agent.template.top5Fastest"),
    dataRows,
    suggestions: [
      t("agent.suggest.compare"),
      t("agent.suggest.directions"),
    ],
  };
}

function generateHoursResponse(
  crossing: MergedCrossingData | null,
  t: (k: string, v?: any) => string
): ResponseContent {
  if (crossing) {
    return {
      text: t("agent.template.hoursAt", { name: crossing.name }),
      dataRows: [
        { label: t("agent.template.hours"), value: crossing.hours },
        { label: t("agent.template.status"), value: crossing.statusNorthbound },
      ],
      suggestions: [
        t("agent.suggest.waitTimes"),
        t("agent.suggest.directions"),
      ],
    };
  }
  return {
    text: t("agent.template.mostOpen"),
    suggestions: [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.whatsHappening"),
    ],
  };
}

function generateDocumentsResponse(
  profile: TravelerProfile | null,
  t: (k: string, v?: any) => string
): ResponseContent {
  const checklist = getDocumentChecklist(profile, t);
  return {
    text: t("agent.template.documentsNeed"),
    checklist,
    suggestions: [
      t("agent.suggest.sentryInfo"),
      t("agent.suggest.rules"),
    ],
  };
}

function generateSentriResponse(
  profile: TravelerProfile | null,
  t: (k: string, v?: any) => string
): ResponseContent {
  if (profile?.trustedTraveler === "sentri") {
    return {
      text: t("agent.template.sentriHas"),
      dataRows: [
        { label: t("agent.template.sentriLanes"), value: "2-10 min", highlight: true },
        { label: t("agent.template.standardLanes"), value: "30-60 min" },
      ],
      suggestions: [
        t("agent.suggest.waitTimes"),
        t("agent.suggest.compare"),
      ],
    };
  }
  return {
    text: t("agent.template.sentriInfo"),
    cards: [
      {
        title: t("agent.template.howToApply"),
        detail: t("agent.template.sentriSteps"),
      },
    ],
    action: {
      label: t("agent.template.applySentri"),
      href: "https://ttp.cbp.dhs.gov/",
    },
    suggestions: [
      t("agent.suggest.documents"),
      t("agent.suggest.waitTimes"),
    ],
  };
}

function generateCompareResponse(
  crossing: MergedCrossingData | null,
  allCrossings: MergedCrossingData[],
  t: (k: string, v?: any) => string
): ResponseContent {
  if (!crossing) {
    const sorted = [...allCrossings].sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound).slice(0, 3);
    const cards: ResponseCard[] = sorted.map((c) => ({
      id: c.id,
      title: c.name,
      subtitle: `${c.mexicanCity} ↔ ${c.usCity}`,
      value: `${c.waitTimeNorthbound}`,
      unit: t("common.min"),
      status: getWaitStatus(c.waitTimeNorthbound),
    }));
    return {
      text: t("agent.template.top3Fastest"),
      cards,
      suggestions: [
        t("agent.suggest.waitTimes"),
        t("agent.suggest.directions"),
      ],
    };
  }
  const nearby = allCrossings.filter((c) => c.id !== crossing.id).sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound).slice(0, 3);
  const dataRows: ResponseDataRow[] = [
    {
      label: t("agent.template.currentWithName", { name: crossing.name }),
      value: `${crossing.waitTimeNorthbound} ${t("common.min")}`,
      highlight: true,
    },
    ...nearby.map((c) => ({
      label: c.name,
      value: `${c.waitTimeNorthbound} ${t("common.min")}`,
    })),
  ];
  return {
    text: t("agent.template.comparingWith", { name: crossing.name }),
    dataRows,
    suggestions: [
      t("agent.suggest.directions"),
      t("agent.suggest.waitTimes"),
    ],
  };
}

function generateStatusResponse(
  crossing: MergedCrossingData | null,
  allCrossings: MergedCrossingData[],
  t: (k: string, v?: any) => string
): ResponseContent {
  if (crossing) {
    return {
      text: t("agent.template.statusAt", { name: crossing.name }),
      dataRows: [
        { label: t("common.northbound"), value: crossing.statusNorthbound },
        { label: t("common.southbound"), value: crossing.statusSouthbound },
        { label: t("agent.template.hours"), value: crossing.hours },
        { label: t("agent.template.lastUpdated"), value: crossing.lastUpdated || t("common.unknown") },
      ],
      suggestions: [
        t("agent.suggest.waitTimes"),
        t("agent.suggest.whatsHappening"),
        t("agent.suggest.directions"),
      ],
    };
  }
  // No specific crossing: show fastest gates as cards so the user can
  // pick one to compare instead of hitting a dead-end text.
  if (allCrossings.length > 0) {
    const sorted = [...allCrossings]
      .sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound)
      .slice(0, 3);
    return {
      text: t("agent.template.allOperating"),
      cards: sorted.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: `${c.mexicanCity} ↔ ${c.usCity}`,
        value: `${c.waitTimeNorthbound}`,
        unit: t("common.min"),
        status: getWaitStatus(c.waitTimeNorthbound),
      })),
      action: {
        label: t("agent.template.viewAllCrossings"),
        href: "/crossings",
      },
      suggestions: [
        t("agent.suggest.compare"),
        t("agent.suggest.directions"),
        t("agent.suggest.waitTimes"),
      ],
    };
  }
  return {
    text: t("agent.template.allOperating"),
    suggestions: [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.whatsHappening"),
    ],
  };
}

function generateRulesResponse(t: (k: string, v?: any) => string): ResponseContent {
  return {
    text: t("agent.template.customsRules"),
    checklist: [
      { label: t("agent.template.ruleFood"), checked: false, required: true },
      { label: t("agent.template.ruleCash"), checked: false, required: true },
      { label: t("agent.template.ruleFruit"), checked: false, required: true },
      { label: t("agent.template.ruleDrugs"), checked: false, required: true },
      { label: t("agent.template.ruleFirearms"), checked: false, required: true },
      { label: t("agent.template.ruleMeds"), checked: false, required: false },
    ],
    suggestions: [
      t("agent.suggest.documents"),
      t("agent.suggest.waitTimes"),
    ],
  };
}

function generateGreetingResponse(
  trip: TripContext,
  t: (k: string, v?: any) => string,
  liveContext?: AgentLiveContext,
  history: ConversationTurn[] = []
): ResponseContent {
  // Returning user with conversation history gets a compact welcome-back.
  if (history.length > 0) {
    return {
      text: t("agent.template.greetingBack"),
      suggestions: [
        t("agent.suggest.waitTimes"),
        t("agent.suggest.whatsHappening"),
        t("agent.suggest.tripHelp"),
      ],
    };
  }
  const hasTrip = trip.completed && trip.destination && trip.start;
  let text = hasTrip
    ? t("agent.template.greetingWithTrip", { start: trip.start!.name, destination: trip.destination!.name })
    : t("agent.template.greetingGeneric");

  // Proactive greeting when live context is available
  if (liveContext?.hasLiveCrossingData && liveContext.hasActiveTrip) {
    const statusText = liveContext.crossingStatus
      ? t(`agent.status.${liveContext.crossingStatus}`)
      : t("agent.status.unknown");
    const waitInfo = liveContext.crossingWaitTime !== undefined
      ? `, wait ${liveContext.crossingWaitTime} min`
      : "";
    text = `${text} ${t("agent.template.proactiveGreeting", {
      city: liveContext.selectedCrossingName || "",
      status: statusText,
      wait: waitInfo,
    })}`;
  }

  return { 
    text,
    suggestions: hasTrip ? [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.directions"),
      t("agent.suggest.whatsHappening"),
    ] : [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.configureTrip"),
      t("agent.suggest.whatsHappening"),
    ],
  };
}

function generateDefaultResponse(t: (k: string, v?: any) => string): ResponseContent {
  return {
    text: t("agent.template.defaultHelp"),
    suggestions: [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.documents"),
      t("agent.suggest.sentryInfo"),
      t("agent.suggest.rules"),
    ],
  };
}

function generateWhatsHappeningResponse(
  allCrossings: MergedCrossingData[],
  t: (k: string, v?: any) => string,
  liveContext?: AgentLiveContext
): ResponseContent {
  const highWait = allCrossings.filter((c) => c.waitTimeNorthbound > 45);
  const lowWait = allCrossings.filter((c) => c.waitTimeNorthbound <= 20);
  const closed = allCrossings.filter((c) => c.statusNorthbound === "CLOSED" || c.statusSouthbound === "CLOSED");
  const limited = allCrossings.filter((c) => c.statusNorthbound === "LIMITED" || c.statusSouthbound === "LIMITED");

  const parts: string[] = [];
  const now = new Date().toLocaleTimeString();

  parts.push(t("agent.template.whatsHappeningNow", { time: now }));

  if (highWait.length > 0) {
    parts.push(t("agent.template.highTraffic", { count: highWait.length }));
    highWait.slice(0, 3).forEach((c) => {
      parts.push(t("agent.template.highTrafficRow", { name: c.name, wait: c.waitTimeNorthbound }));
    });
  }

  if (lowWait.length > 0) {
    parts.push(t("agent.template.fastCrossings", { count: lowWait.length }));
    lowWait.slice(0, 3).forEach((c) => {
      parts.push(t("agent.template.fastRow", { name: c.name, wait: c.waitTimeNorthbound }));
    });
  }

  if (closed.length > 0) {
    parts.push(t("agent.template.closedList", { names: closed.map((c) => c.name).join(", ") }));
  }

  if (limited.length > 0) {
    parts.push(t("agent.template.limitedList", { names: limited.map((c) => c.name).join(", ") }));
  }

  if (highWait.length === 0 && lowWait.length > 0) {
    parts.push(t("agent.template.allFlowing"));
  }

  // Add live context freshness indicator
  if (liveContext?.hasLiveCrossingData) {
    const freshnessLabel = t(`agent.freshness.${liveContext.crossingFreshness}`);
    parts.push(t("agent.template.liveDataFreshness", { freshness: freshnessLabel }));
  }

  return {
    text: parts.join("\n"),
    action: {
      label: t("agent.template.viewAllCrossings"),
      href: "/crossings",
    },
    suggestions: [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.directions"),
      t("agent.suggest.compare"),
    ],
  };
}

/**
 * Direction intent handler — shows current crossing status & wait time
 */
function generateDirectionResponse(
  crossing: MergedCrossingData | null,
  allCrossings: MergedCrossingData[],
  t: (k: string, values?: Record<string, any>) => string,
  liveContext?: AgentLiveContext
): ResponseContent {
  // Prefer live context data if available and relevant
  const liveCrossing = liveContext?.hasLiveCrossingData && liveContext.crossingWaitTime !== undefined;
  const waitTime = liveCrossing ? liveContext.crossingWaitTime : crossing?.waitTimeNorthbound;
  const status = liveCrossing ? liveContext.crossingStatus : crossing?.statusNorthbound;
  const name = liveCrossing && liveContext.selectedCrossingName
    ? liveContext.selectedCrossingName
    : crossing?.name;

  if (waitTime !== undefined && name) {
    const statusText = status
      ? t(`agent.status.${status}`)
      : t("agent.status.unknown");
    return {
      text: t("agent.template.directionAt", {
        name,
        status: statusText,
        wait: `${waitTime} ${t("common.min")}`,
      }),
      cards: [
        {
          id: crossing?.id ?? liveContext?.selectedCrossingId ?? undefined,
          title: t("agent.template.currentCrossing"),
          subtitle: t("agent.template.waitTime"),
          value: `${waitTime} ${t("common.min")}`,
          status: status === "open" ? "open" : status === "limited" ? "limited" : status === "closed" ? "closed" : "neutral",
        },
      ],
      action: crossing ? {
        label: t("agent.template.viewCrossingDetails"),
        href: `/crossing/${crossing.id}`,
      } : undefined,
      suggestions: [
        t("agent.suggest.waitTimes"),
        t("agent.suggest.compare"),
        t("agent.suggest.whatsHappening"),
      ],
    };
  }

  // No specific crossing: resolve a real fallback gate so the card is
  // tappable instead of a dead label.
  const fallback =
    allCrossings.find((c) => c.id === "san-ysidro") ??
    [...allCrossings].sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound)[0] ??
    null;

  if (fallback) {
    return {
      text: t("agent.template.noCurrentCrossing"),
      cards: [
        {
          id: fallback.id,
          title: t("agent.template.mostCommon"),
          subtitle: fallback.name,
          value: `${fallback.waitTimeNorthbound} ${t("common.min")}`,
          status: getWaitStatus(fallback.waitTimeNorthbound),
        },
      ],
      action: {
        label: t("agent.template.viewCrossingDetails"),
        href: `/crossing/${fallback.id}`,
      },
      suggestions: [
        t("agent.suggest.waitTimes"),
        t("agent.suggest.whatsHappening"),
      ],
    };
  }

  return {
    text: t("agent.template.noCurrentCrossing"),
    cards: [
      {
        title: t("agent.template.mostCommon"),
        value: t("agent.template.mostCommonCrossing"),
      },
    ],
    action: {
      label: t("agent.template.viewCrossings"),
      href: "/crossings",
    },
    suggestions: [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.whatsHappening"),
    ],
  };
}

/**
 * General intent handler — provides general agent assistance
 */
function generateGeneralResponse(
  trip: TripContext,
  profile: TravelerProfile | null,
  t: (k: string, values?: Record<string, any>) => string,
  liveContext?: AgentLiveContext,
  history: ConversationTurn[] = []
): ResponseContent {
  const hasTrip = trip.completed && trip.start && trip.destination;

  let text = hasTrip
    ? t("agent.template.generalWithTrip", {
        start: trip.start!.name,
        destination: trip.destination!.name,
      })
    : t("agent.template.generalHelp");

  if (history.length > 0) {
    text = `${t("agent.template.followUpContext")} ${text}`;
  }

  // Add live context if available
  if (liveContext?.hasLiveCrossingData && liveContext.hasActiveTrip) {
    const statusText = liveContext.crossingStatus
      ? t(`agent.status.${liveContext.crossingStatus}`)
      : t("agent.status.unknown");
    const waitInfo = liveContext.crossingWaitTime !== undefined
      ? ` ${t("common.currentWait")} ${liveContext.crossingWaitTime} ${t("common.min")}`
      : "";
    text += ` ${t("agent.template.liveContextNote", {
      city: liveContext.selectedCrossingName || "",
      status: statusText,
      wait: waitInfo,
    })}`;
  }

  return { 
    text,
    suggestions: hasTrip ? [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.directions"),
      t("agent.suggest.whatsHappening"),
    ] : [
      t("agent.suggest.waitTimes"),
      t("agent.suggest.configureTrip"),
      t("agent.suggest.whatsHappening"),
      t("agent.suggest.documents"),
    ],
  };
}
