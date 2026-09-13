import type { AgentMessage } from "@/stores/agent";

/**
 * Agent context awareness — conversation history + follow-up resolution.
 *
 * Rule-based, no LLM: detects follow-up signals (pronouns, affirmations,
 * fragments) and re-attaches the previous user turn so the existing
 * intent classifier and crossing extractor resolve against full context.
 */

export interface ConversationTurn {
  role: "user" | "assistant";
  text: string;
}

export interface ResolvedFollowUp {
  /** Message to classify/extract against (original + inherited context). */
  effectiveMessage: string;
  /** True when previous-turn context was attached. */
  usedHistory: boolean;
}

const MAX_HISTORY_TURNS = 6;

const FOLLOW_UP_PATTERN =
  /\b(it|that|there|this|those|ello|eso|esa|ese|ah[ií]|all[aá]|y\s|and\s|what about|y qu[eé]|pero\b)/i;

const AFFIRMATION_PATTERN =
  /^(yes|yeah|yep|ok(ay)?|sure|dale|va|s[ií]|claro|exacto|correcto)[\s!.?]*$/i;

export function buildHistory(messages: AgentMessage[], limit = MAX_HISTORY_TURNS): ConversationTurn[] {
  return messages
    .slice(-limit)
    .map((m) => ({ role: m.role, text: m.content }));
}

function lastUserText(history: ConversationTurn[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "user") return history[i].text;
  }
  return null;
}

/**
 * Resolve a raw user message against conversation history.
 *
 * - No history → passthrough.
 * - Affirmation ("yes", "sí") → classify as the previous user turn
 *   (accepts whatever the agent just offered).
 * - Pronoun/fragment signal ("it", "that crossing", "y los documentos?")
 *   → append previous user turn for classifier/extractor context.
 * - Otherwise → passthrough (fresh intent).
 */
export function resolveFollowUp(
  message: string,
  history: ConversationTurn[]
): ResolvedFollowUp {
  const trimmed = message.trim();
  if (history.length === 0) {
    return { effectiveMessage: message, usedHistory: false };
  }

  const previous = lastUserText(history);
  if (!previous || previous.trim().toLowerCase() === trimmed.toLowerCase()) {
    return { effectiveMessage: message, usedHistory: false };
  }

  if (AFFIRMATION_PATTERN.test(trimmed) || FOLLOW_UP_PATTERN.test(trimmed)) {
    return { effectiveMessage: `${trimmed} ${previous}`, usedHistory: true };
  }

  return { effectiveMessage: message, usedHistory: false };
}
