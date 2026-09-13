/**
 * Intent Classifier
 * Rule-based intent detection for agent chat messages.
 * Maps user messages to intent bands for response template selection.
 */

export type IntentBand =
  | "wait_times"
  | "hours"
  | "documents"
  | "sentry"
  | "compare"
  | "status"
  | "rules"
  | "direction"
  | "general"
  | "greeting"
  | "whatshappening";

interface IntentRule {
  intent: IntentBand;
  patterns: RegExp[];
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "wait_times",
    patterns: [
      /\b(wait|tiempo|cuanto tarda|cuánto tarda|tarda|cola|fila|line)\b/i,
      /\b(how long|cuanto tiempo|cuánto tiempo|espera)\b/i,
      /\b(min|minutes|minutos|hrs?|hours?)\b/i,
      /\b(waiting|esperando|queue|lineup)\b/i,
    ],
  },
  {
    intent: "hours",
    patterns: [
      /\b(hours?|horario|horas?|open|closed|abierto|cerrado)\b/i,
      /\b(what time|que hora|qué hora|什么时候|a que hora|a qué hora)\b/i,
      /\b(24\s*(hr|hour|horas?))\b/i,
      /\b(schedule|cronograma)\b/i,
    ],
  },
  {
    intent: "documents",
    patterns: [
      /\b(documents?|documentos?|papers?|papeles?|passport|pasaporte)\b/i,
      /\b(id|identification|identificación|credencial)\b/i,
      /\b(visa|visa|tarjeta|card)\b/i,
      /\b(what do i need|que necesito|qué necesito|necesito)\b/i,
      /\b(requirements?|requisitos?|required|required)\b/i,
    ],
  },
  {
    intent: "sentry",
    patterns: [
      /\b(sentri|SENTRI|trusted traveler|viajero confiable)\b/i,
      /\b(global entry|globalentry|nexus|fast)\b/i,
      /\b(expedited|rápido|rapido|express)\b/i,
      /\b(how to get|como obtener|cómo obtener|apply|aplicar)\b/i,
    ],
  },
  {
    intent: "compare",
    patterns: [
      /\b(compare|comparar|comparación|comparison)\b/i,
      /\b(which|cual|cuál|mejor|best|faster|más rápido)\b/i,
      /\b(alternative|alternativa|otro|other)\b/i,
      /\b(near|cerca|close|cercano)\b/i,
    ],
  },
  {
    intent: "status",
    patterns: [
      /\b(status|estado|situación|situation)\b/i,
      /\b(open|closed|limited|abierto|cerrado|limitado)\b/i,
      /\b(happening|pasando|qué pasa|que pasa)\b/i,
      /\b(now|ahora|currently|actualmente)\b/i,
    ],
  },
  {
    intent: "rules",
    patterns: [
      /\b(rules|reglas|regulaciones|regulations)\b/i,
      /\b(can i bring|puedo llevar|puedo traer|puedo llevar)\b/i,
      /\b(prohibited|prohibido|allowed|permitido)\b/i,
      /\b(customs|aduana|declaring|declarar)\b/i,
      /\b(chemicals|chemical|food|comida|fruits?|fruta|meat|carne)\b/i,
    ],
  },
  {
    intent: "direction",
    patterns: [
      /\b(directions?|direcci(o|ó)n(es)?|direcion(es)?|going to|yendo a|voy a)\b/i,
      /\b(north|south|sur|norte)\b/i,
      /\b(MX|US|Mexico|Estados Unidos|México|USA)\b/i,
    ],
  },
  {
    intent: "greeting",
    patterns: [
      /\b(hello|hi|hey|hola|buenos|buenas|que tal|qué tal)\b/i,
      /\b(help|ayuda|ayudame|ayúdame)\b/i,
      /\b(what can you|que puedes|qué puedes)\b/i,
    ],
  },
  {
    intent: "whatshappening",
    patterns: [
      /\b(what.?s happening|que esta pasando|qué está pasando|qué pasa|que pasa)\b/i,
      /\b(current status|estado actual|situacion|situación)\b/i,
      /\b(any alerts?|hay alertas?|noticias?|news?)\b/i,
      /\b(breaking|urgente|urgent|important)\b/i,
    ],
  },
];

/**
 * Classify a user message into an intent band.
 * Returns the first matching intent, or "general" if none match.
 */
export function classifyIntent(message: string): IntentBand {
  const normalized = message.trim().toLowerCase();

  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(normalized)) {
        return rule.intent;
      }
    }
  }

  return "general";
}

/**
 * Extract mentioned crossing name from message.
 * Returns the crossing ID if found, or null.
 */
export function extractCrossingMention(
  message: string,
  crossings: Array<{ id: string; name: string; mexicanCity: string; usCity: string }>
): string | null {
  const lower = message.toLowerCase();

  for (const crossing of crossings) {
    if (lower.includes(crossing.name.toLowerCase())) {
      return crossing.id;
    }
    if (lower.includes(crossing.mexicanCity.toLowerCase())) {
      return crossing.id;
    }
    if (lower.includes(crossing.usCity.toLowerCase())) {
      return crossing.id;
    }
  }

  return null;
}

/**
 * Extract direction from message (MX_TO_US or US_TO_MX).
 */
export function extractDirection(message: string): "MX_TO_US" | "US_TO_MX" | null {
  const lower = message.toLowerCase();

  if (/\b(to us|to usa|to states|a estados|a eeuu|northbound|norte)\b/i.test(lower)) {
    return "MX_TO_US";
  }
  if (/\b(to mx|to mexico|a mexico|southbound|sur)\b/i.test(lower)) {
    return "US_TO_MX";
  }

  return null;
}
