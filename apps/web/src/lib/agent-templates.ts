/**
 * Agent Response Templates — i18n via next-intl t()
 * All user-facing strings come from messages/{es,en}.json agent.template.* + agent.checklist.*
 * No hardcoded Spanish/English — caller must pass t from useTranslations().
 */

import type { IntentBand } from "./intent-classifier";
import type { MergedCrossingData } from "./border-data-service";
import type { TravelerProfile } from "@/types";

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
}

export interface ResponseCard {
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
  const { crossing, allCrossings, trip, profile, t } = ctx;
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
      return generateStatusResponse(crossing, t);
    case "rules":
      return generateRulesResponse(t);
    case "greeting":
      return generateGreetingResponse(trip, t);
    case "whatshappening":
      return generateWhatsHappeningResponse(allCrossings, t);
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
    };
  }
  return {
    text: t("agent.template.mostOpen"),
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
      title: c.name,
      subtitle: `${c.mexicanCity} ↔ ${c.usCity}`,
      value: `${c.waitTimeNorthbound}`,
      unit: t("common.min"),
      status: getWaitStatus(c.waitTimeNorthbound),
    }));
    return {
      text: t("agent.template.top3Fastest"),
      cards,
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
  };
}

function generateStatusResponse(
  crossing: MergedCrossingData | null,
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
    };
  }
  return {
    text: t("agent.template.allOperating"),
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
  };
}

function generateGreetingResponse(trip: TripContext, t: (k: string, v?: any) => string): ResponseContent {
  const hasTrip = trip.completed && trip.destination && trip.start;
  if (hasTrip) {
    return {
      text: t("agent.template.greetingWithTrip", { start: trip.start!.name, destination: trip.destination!.name }),
    };
  }
  return {
    text: t("agent.template.greetingGeneric"),
  };
}

function generateDefaultResponse(t: (k: string, v?: any) => string): ResponseContent {
  return {
    text: t("agent.template.defaultHelp"),
  };
}

function generateWhatsHappeningResponse(
  allCrossings: MergedCrossingData[],
  t: (k: string, v?: any) => string
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

  return {
    text: parts.join("\n"),
    action: {
      label: t("agent.template.viewAllCrossings"),
      href: "/crossings",
    },
  };
}
