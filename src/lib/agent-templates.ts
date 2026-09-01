/**
 * Agent Response Templates
 * Rule-based response generation for each intent band.
 * Returns structured content for the rich response renderer.
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
  locale: string;
}

function getWaitStatus(wait: number): "open" | "limited" | "closed" {
  if (wait <= 30) return "open";
  if (wait <= 60) return "limited";
  return "closed";
}

function getTrendEmoji(wait: number): string {
  if (wait <= 15) return "🟢";
  if (wait <= 30) return "🟡";
  return "🔴";
}

function getDocumentChecklist(profile: TravelerProfile | null): ResponseChecklistItem[] {
  const items: ResponseChecklistItem[] = [
    { label: "Valid passport", checked: true, required: true },
  ];

  if (profile?.usVisaType === "b1_b2") {
    items.push({ label: "US visa (B1/B2)", checked: true, required: true });
  }

  if (profile?.hasSentri) {
    items.push({ label: "SENTRI card", checked: true, required: false });
  }

  items.push({ label: "Vehicle registration (if driving)", checked: false, required: false });
  items.push({ label: "Mexican auto insurance (if driving)", checked: false, required: false });

  return items;
}

export function generateResponse(
  intent: IntentBand,
  ctx: TemplateContext
): ResponseContent {
  const { crossing, allCrossings, trip, profile, locale } = ctx;
  const isEn = locale === "en";

  switch (intent) {
    case "wait_times":
      return generateWaitTimesResponse(crossing, allCrossings, isEn);

    case "hours":
      return generateHoursResponse(crossing, isEn);

    case "documents":
      return generateDocumentsResponse(profile, isEn);

    case "sentry":
      return generateSentriResponse(profile, isEn);

    case "compare":
      return generateCompareResponse(crossing, allCrossings, isEn);

    case "status":
      return generateStatusResponse(crossing, isEn);

    case "rules":
      return generateRulesResponse(isEn);

    case "greeting":
      return generateGreetingResponse(trip, isEn);

    case "whatshappening":
      return generateWhatsHappeningResponse(allCrossings, isEn);

    default:
      return generateDefaultResponse(isEn);
  }
}

function generateWaitTimesResponse(
  crossing: MergedCrossingData | null,
  allCrossings: MergedCrossingData[],
  isEn: boolean
): ResponseContent {
  if (crossing) {
    const lanes = crossing.lanesNorthbound.slice(0, 3);
    const cards: ResponseCard[] = lanes.map((lane) => ({
      title: lane.name,
      value: `${lane.waitTime}`,
      unit: "min",
      status: getWaitStatus(lane.waitTime),
      detail: lane.isOpen ? "Open" : "Closed",
    }));

    return {
      text: isEn
        ? `Current wait times at ${crossing.name}:`
        : `Tiempos de espera actuales en ${crossing.name}:`,
      cards,
      action: {
        label: isEn ? "View crossing details" : "Ver detalles del cruce",
        href: `/crossing/${crossing.id}`,
      },
    };
  }

  const sorted = [...allCrossings]
    .sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound)
    .slice(0, 5);

  const dataRows: ResponseDataRow[] = sorted.map((c) => ({
    label: c.name,
    value: `${c.waitTimeNorthbound} min`,
    highlight: c.waitTimeNorthbound <= 20,
  }));

  return {
    text: isEn
      ? "Top 5 fastest crossings right now:"
      : "Los 5 cruces más rápidos ahora:",
    dataRows,
  };
}

function generateHoursResponse(
  crossing: MergedCrossingData | null,
  isEn: boolean
): ResponseContent {
  if (crossing) {
    return {
      text: isEn
        ? `${crossing.name} operating hours:`
        : `Horario de ${crossing.name}:`,
      dataRows: [
        { label: isEn ? "Hours" : "Horario", value: crossing.hours },
        { label: isEn ? "Status" : "Estado", value: crossing.statusNorthbound },
      ],
    };
  }

  return {
    text: isEn
      ? "Most border crossings are open 24/7. Some pedestrian crossings have limited hours."
      : "La mayoría de los cruces están abiertos 24/7. Algunos cruces peatonales tienen horario limitado.",
  };
}

function generateDocumentsResponse(
  profile: TravelerProfile | null,
  isEn: boolean
): ResponseContent {
  const checklist = getDocumentChecklist(profile);

  return {
    text: isEn
      ? "Documents you'll need for crossing:"
      : "Documentos que necesitas para cruzar:",
    checklist,
  };
}

function generateSentriResponse(
  profile: TravelerProfile | null,
  isEn: boolean
): ResponseContent {
  if (profile?.hasSentri) {
    return {
      text: isEn
        ? "You have SENTRI! Use the dedicated SENTRI lanes for the fastest crossing."
        : "¡Tienes SENTRI! Usa las carriles dedicadas de SENTRI para el cruce más rápido.",
      dataRows: [
        { label: "SENTRI lanes", value: "2-10 min", highlight: true },
        { label: "Standard lanes", value: "30-60 min" },
      ],
    };
  }

  return {
    text: isEn
      ? "SENTRI (Trusted Traveler) lets you use expedited lanes at the border."
      : "SENTRI (Viajero Confiable) te permite usar carriles expedidos en la frontera.",
    cards: [
      {
        title: isEn ? "How to apply" : "Cómo aplicar",
        detail: isEn
          ? "1. Create a TTP account\n2. Pay $122.50 fee\n3. Complete interview at enrollment center"
          : "1. Crea una cuenta TTP\n2. Paga $122.50\n3. Completa entrevista en centro de inscripción",
      },
    ],
    action: {
      label: isEn ? "Apply for SENTRI" : "Aplicar para SENTRI",
      href: "https://ttp.cbp.dhs.gov/",
    },
  };
}

function generateCompareResponse(
  crossing: MergedCrossingData | null,
  allCrossings: MergedCrossingData[],
  isEn: boolean
): ResponseContent {
  if (!crossing) {
    const sorted = [...allCrossings]
      .sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound)
      .slice(0, 3);

    const cards: ResponseCard[] = sorted.map((c) => ({
      title: c.name,
      subtitle: `${c.mexicanCity} ↔ ${c.usCity}`,
      value: `${c.waitTimeNorthbound}`,
      unit: "min",
      status: getWaitStatus(c.waitTimeNorthbound),
    }));

    return {
      text: isEn
        ? "Top 3 fastest crossings:"
        : "Los 3 cruces más rápidos:",
      cards,
    };
  }

  const nearby = allCrossings
    .filter((c) => c.id !== crossing.id)
    .sort((a, b) => a.waitTimeNorthbound - b.waitTimeNorthbound)
    .slice(0, 3);

  const dataRows: ResponseDataRow[] = [
    {
      label: `${crossing.name} (current)`,
      value: `${crossing.waitTimeNorthbound} min`,
      highlight: true,
    },
    ...nearby.map((c) => ({
      label: c.name,
      value: `${c.waitTimeNorthbound} min`,
    })),
  ];

  return {
    text: isEn
      ? `Comparing ${crossing.name} with nearby alternatives:`
      : `Comparando ${crossing.name} con alternativas cercanas:`,
    dataRows,
  };
}

function generateStatusResponse(
  crossing: MergedCrossingData | null,
  isEn: boolean
): ResponseContent {
  if (crossing) {
    return {
      text: isEn
        ? `Current status at ${crossing.name}:`
        : `Estado actual en ${crossing.name}:`,
      dataRows: [
        { label: isEn ? "Northbound" : "Norte", value: crossing.statusNorthbound },
        { label: isEn ? "Southbound" : "Sur", value: crossing.statusSouthbound },
        { label: isEn ? "Hours" : "Horario", value: crossing.hours },
        { label: isEn ? "Last updated" : "Última actualización", value: crossing.lastUpdated || "Unknown" },
      ],
    };
  }

  return {
    text: isEn
      ? "All crossings are currently operating. Check specific crossing for detailed status."
      : "Todos los cruces están operando. Consulta un cruce específico para detalles.",
  };
}

function generateRulesResponse(isEn: boolean): ResponseContent {
  return {
    text: isEn
      ? "US customs rules for entering from Mexico:"
      : "Reglas de aduana de EE.UU. para entrar desde México:",
    checklist: [
      { label: isEn ? "Declare all food, plants, and animals" : "Declara todos los alimentos, plantas y animales", checked: false, required: true },
      { label: isEn ? "Declare amounts over $10,000 USD" : "Declara cantidades mayores a $10,000 USD", checked: false, required: true },
      { label: isEn ? "No fruits, vegetables, or meats from Mexico" : "No frutas, verduras o carnes de México", checked: false, required: true },
      { label: isEn ? "No illegal drugs or substances" : "No drogas ilegales o sustancias", checked: false, required: true },
      { label: isEn ? "No firearms without permit" : "No armas de fuego sin permiso", checked: false, required: true },
      { label: isEn ? "Prescription meds in original container" : "Medicamentos recetados en envase original", checked: false, required: false },
    ],
  };
}

function generateGreetingResponse(trip: TripContext, isEn: boolean): ResponseContent {
  const hasTrip = trip.completed && trip.destination && trip.start;

  if (hasTrip) {
    return {
      text: isEn
        ? `Hi! I see you're traveling from ${trip.start!.name} to ${trip.destination!.name}. How can I help?`
        : `¡Hola! Veo que viajas de ${trip.start!.name} a ${trip.destination!.name}. ¿Cómo puedo ayudarte?`,
    };
  }

  return {
    text: isEn
      ? "Hi! I'm your CRUZE assistant. I can help with:\n• Wait times at crossings\n• Required documents\n• SENTRI information\n• Crossing comparisons\n• Customs rules\n\nWhat would you like to know?"
      : "¡Hola! Soy tu asistente de CRUZE. Puedo ayudarte con:\n• Tiempos de espera en cruces\n• Documentos requeridos\n• Información sobre SENTRI\n• Comparación de cruces\n• Reglas de aduana\n\n¿Qué te gustaría saber?",
  };
}

function generateDefaultResponse(isEn: boolean): ResponseContent {
  return {
    text: isEn
      ? "I can help with crossing information. Try asking about:\n• Wait times\n• Documents needed\n• SENTRI\n• Crossing comparisons\n• Customs rules"
      : "Puedo ayudarte con información de cruces. Pregunta sobre:\n• Tiempos de espera\n• Documentos necesarios\n• SENTRI\n• Comparación de cruces\n• Reglas de aduana",
  };
}

function generateWhatsHappeningResponse(
  allCrossings: MergedCrossingData[],
  isEn: boolean
): ResponseContent {
  const now = new Date();
  const hour = now.getHours();

  // Find crossings with high wait times
  const highWait = allCrossings.filter((c) => c.waitTimeNorthbound > 45);
  const lowWait = allCrossings.filter((c) => c.waitTimeNorthbound <= 20);

  // Find closed crossings
  const closed = allCrossings.filter(
    (c) => c.statusNorthbound === "CLOSED" || c.statusSouthbound === "CLOSED"
  );

  // Find limited crossings
  const limited = allCrossings.filter(
    (c) => c.statusNorthbound === "LIMITED" || c.statusSouthbound === "LIMITED"
  );

  const parts: string[] = [];

  if (isEn) {
    parts.push(`Here's what's happening at the border right now (${now.toLocaleTimeString()}):`);

    if (highWait.length > 0) {
      parts.push(`\n⚠️ High traffic (${highWait.length} crossings):`);
      highWait.slice(0, 3).forEach((c) => {
        parts.push(`• ${c.name}: ${c.waitTimeNorthbound} min wait`);
      });
    }

    if (lowWait.length > 0) {
      parts.push(`\n✅ Fast crossings (${lowWait.length}):`);
      lowWait.slice(0, 3).forEach((c) => {
        parts.push(`• ${c.name}: ${c.waitTimeNorthbound} min`);
      });
    }

    if (closed.length > 0) {
      parts.push(`\n🚫 Closed: ${closed.map((c) => c.name).join(", ")}`);
    }

    if (limited.length > 0) {
      parts.push(`\n⚠️ Limited service: ${limited.map((c) => c.name).join(", ")}`);
    }

    if (highWait.length === 0 && lowWait.length > 0) {
      parts.push("\n\nAll crossings are moving well!");
    }
  } else {
    parts.push(`Así está la frontera ahora (${now.toLocaleTimeString()}):`);

    if (highWait.length > 0) {
      parts.push(`\n⚠️ Tráfico alto (${highWait.length} cruces):`);
      highWait.slice(0, 3).forEach((c) => {
        parts.push(`• ${c.name}: ${c.waitTimeNorthbound} min de espera`);
      });
    }

    if (lowWait.length > 0) {
      parts.push(`\n✅ Cruces rápidos (${lowWait.length}):`);
      lowWait.slice(0, 3).forEach((c) => {
        parts.push(`• ${c.name}: ${c.waitTimeNorthbound} min`);
      });
    }

    if (closed.length > 0) {
      parts.push(`\n🚫 Cerrados: ${closed.map((c) => c.name).join(", ")}`);
    }

    if (limited.length > 0) {
      parts.push(`\n⚠️ Servicio limitado: ${limited.map((c) => c.name).join(", ")}`);
    }

    if (highWait.length === 0 && lowWait.length > 0) {
      parts.push("\n\n¡Todos los cruces están fluidos!");
    }
  }

  return {
    text: parts.join("\n"),
    action: {
      label: isEn ? "View all crossings" : "Ver todos los cruces",
      href: "/crossings",
    },
  };
}
