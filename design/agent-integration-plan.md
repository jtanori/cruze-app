# Agent (Assistant) Integration Plan

**Status:** Design + implementation plan
**Last updated:** 2026-08-31
**Source:** `docs/MONETIZATION_STRATEGY.md` (Assistant section), current `AgentChat` shell

---

## Overview

The Agent tab is CRUZE's AI assistant — a conversational interface that helps users with crossing-related questions, trip planning, and (later) curated commercial services. The current implementation is a UI shell with placeholder responses. This plan defines what the Agent should do, how it should behave, and the implementation roadmap.

---

## Product Vision

From the monetization strategy:
> "Answer serious, practical questions: insurance needs, pre-cross checklist, documents, safety, 'what do I do if…'. Offer curated partner solutions when the user is shopping for a concrete service."

### Core Principles

1. **Guidance first, commerce second** — Answer the question helpfully before suggesting anything commercial
2. **Intent-driven** — Only show partners when user intent is commercial/service-seeking
3. **Sensitive = clean** — Emergency, crime, medical, immigration distress → zero commerce, official resources only
4. **Quality measured on usefulness** — Partner CTR is secondary to answer helpfulness
5. **Context-aware** — Knows the user's trip, crossing, traveler profile, and live wait times

---

## Conversation Capabilities

### Tier 1: Guided Knowledge (Rule-Based)

These can be implemented with templates + data lookups, no LLM needed.

| Topic | Example Questions | Response Type |
|-------|-------------------|---------------|
| **Crossing hours** | "What time does San Ysidro close?" | Structured card with hours |
| **Wait times** | "How long is the wait at Otay?" | Live data card with lanes |
| **Documents** | "What documents do I need to cross?" | Checklist based on traveler profile |
| **SENTRI info** | "How do I get SENTRI?" | Structured guide with steps |
| **Crossing comparison** | "Which is faster, San Ysidro or Otay?" | Comparison card with both wait times |
| **Lane eligibility** | "Can I use the SENTRI lane?" | Based on traveler profile |
| **Rules** | "Can I bring food from Mexico?" | Customs rules lookup |
| **Status** | "Is the border open?" | Live status for configured crossing |

### Tier 2: Conversational Assistance (LLM-Backed)

These require an LLM backend with context injection.

| Capability | Description |
|------------|-------------|
| **Trip planning** | "I'm driving from Monterrey to LA, what's the best route?" |
| **Crossing advice** | "I have a big truck, which crossing is best?" |
| **Troubleshooting** | "My SENTRI card expired, what do I do?" |
| **Safety guidance** | "Is it safe to cross at night?" |
| **Document help** | "My visa expires next month, can I still cross?" |
| **Multi-language** | Answer in user's preferred language (EN/ES) |

### Tier 3: Commercial Services (Intent-Driven, Phase 1)

Partners shown only on `service_seek` intent.

| Category | Example Partners | When Shown |
|----------|-----------------|------------|
| **Insurance** | Auto insurance, health insurance | "Do I need insurance?" |
| **Tires** | Tire shops near crossing | "Where can I change tires?" |
| **FX** | Currency exchange | "Where can I exchange money?" |
| **Parking** | Long-term parking near POE | "Where can I park?" |
| **Clinics** | Medical clinics near crossing | "I need a doctor" |
| **Gas** | Gas stations near crossing | "Where's the cheapest gas?" |

---

## Architecture

### Context Injection

Every LLM request includes system context:

```ts
interface AgentContext {
  // Trip context
  trip: {
    origin: Place | null;
    destination: Place | null;
    direction: TripDirection | null;
    recommendedCrossing: string | null;
  } | null;
  
  // Traveler profile
  profile: {
    crossingMode: CrossingMode;
    hasSentri: boolean;
    usVisaType: VisaType | null;
    mxVisaType: VisaType | null;
    passportCountry: string | null;
  } | null;
  
  // Live data
  liveData: {
    currentCrossing: MergedCrossingData | null;
    nearbyCrossings: MergedCrossingData[];
  };
  
  // User preferences
  locale: "en" | "es";
}
```

### Intent Classification

```ts
type IntentBand = 
  | "guidance_only"    // checklist, legal, safety → no commerce
  | "service_seek"     // insurance, mechanic, FX → partners OK
  | "mixed"            // guidance + service → guidance first, one partner after
  | "crisis";          // emergency, harm → no commerce, official resources only

function classifyIntent(message: string): IntentBand {
  // Crisis signals first
  if (CRISIS_KEYWORDS.some(k => message.includes(k))) return "crisis";
  // Service signals
  if (SERVICE_KEYWORDS.some(k => message.includes(k))) return "service_seek";
  // Mixed (checklist + service)
  if (GUIDANCE_KEYWORDS.some(k => message.includes(k))) {
    if (SERVICE_KEYWORDS.some(k => message.includes(k))) return "mixed";
    return "guidance_only";
  }
  return "guidance_only";
}
```

### Response Pipeline

```
User message
  → Intent classifier
  → Context injection (trip, profile, live data)
  → LLM or template selection
  → Response generation
  → Partner injection (if service_seek intent + partners enabled)
  → Safety filter (crisis = no commerce)
  → Render
```

---

## UI Components

### Existing (Shell)
- `AgentChat.tsx` — Message list, input bar, suggested prompts

### To Build

| Component | Description |
|-----------|-------------|
| `AgentProvider` | Context provider for agent state, context injection |
| `MessageBubble` | Updated bubble with rich content support (cards, lists, chips) |
| `RichResponse` | Structured response renderer (checklists, data cards, comparisons) |
| `PartnerCard` | Sponsored partner card with clear labeling |
| `SuggestedActions` | Post-response action chips (e.g., "View crossing", "Start trip") |
| `TypingIndicator` | Loading state while generating response |
| `WelcomeScreen` | Updated welcome with personalized suggestions based on trip state |

### Rich Response Types

```ts
type RichContent = 
  | { type: "text"; content: string }
  | { type: "checklist"; items: Array<{ label: string; checked?: boolean }> }
  | { type: "crossing_card"; crossing: MergedCrossingData }
  | { type: "comparison"; crossings: MergedCrossingData[] }
  | { type: "data_row"; label: string; value: string }
  | { type: "partner"; partner: PartnerCard }
  | { type: "action"; label: string; action: string }
  | { type: "error"; message: string };
```

---

## Implementation Phases

### Phase 1: Rule-Based Assistant (No LLM)

**Goal:** Working assistant with template responses for common questions.

| Step | What | Files |
|------|------|-------|
| 1 | Intent classifier | `lib/intent-classifier.ts` |
| 2 | Response templates | `lib/agent-templates.ts` |
| 3 | Context provider | `components/agent/AgentProvider.tsx` |
| 4 | Rich response renderer | `components/agent/RichResponse.tsx` |
| 5 | Update AgentChat | `components/agent/AgentChat.tsx` |
| 6 | Welcome screen update | Personalized based on trip state |
| 7 | i18n | EN/ES template strings |

**Templates to build:**

```
/wait_times       → Live data card for current crossing or all crossings
/hours            → Operating hours card
/documents        → Checklist based on profile (passport, visa, SENTRI)
/sentry           → SENTRI guide with steps and link
/compare          → Side-by-side crossing comparison
/status           → Live status for configured crossing
/rules            → Customs rules lookup
/default          → "I can help with crossing info. Try asking about wait times, documents, or SENTRI."
```

### Phase 2: LLM Integration

**Goal:** Natural language understanding for complex questions.

| Step | What | Files |
|------|------|-------|
| 1 | LLM API integration | `lib/llm-client.ts` |
| 2 | System prompt with context | `lib/agent-prompts.ts` |
| 3 | Streaming response support | `components/agent/AgentChat.tsx` update |
| 4 | Error handling + fallback to templates | `lib/agent-error-handler.ts` |
| 5 | Token management | `lib/agent-tokens.ts` |

**System prompt structure:**

```
You are CRUZE, a border-crossing intelligence assistant for the US-Mexico border.

Current context:
- User is crossing from {origin} to {destination}
- Recommended crossing: {crossing_name}
- Wait time: {wait_time} minutes
- User has SENTRI: {has_sentri}
- User's visa: {visa_type}
- Crossing mode: {crossing_mode}

Rules:
- Answer in {locale}
- Be concise and practical
- Never fabricate wait times or crossing status
- For crisis/emergency: point to official resources only
- For commercial questions: be helpful but neutral
```

### Phase 3: Partner Integration

**Goal:** Contextual partner suggestions on service-seeking turns.

| Step | What | Files |
|------|------|-------|
| 1 | Partner catalog | `lib/partners.ts` |
| 2 | Partner matching by corridor + intent | `lib/partner-matcher.ts` |
| 3 | PartnerCard component | `components/agent/PartnerCard.tsx` |
| 4 | Display rules enforcement | `lib/agent-rules.ts` |
| 5 | Analytics tracking | `lib/analytics.ts` events |

### Phase 4: Advanced Features

| Feature | Description |
|---------|-------------|
| **Proactive suggestions** | "Your crossing usually gets busy at 5pm. Leave by 4:30?" |
| **Trip tracking** | "You're 20 min from Otay. Wait time is 35 min." |
| **Crossing history** | "Last time you crossed at San Ysidro, it took 45 min." |
| **Multi-turn conversations** | Context carries across messages |
| **Voice input** | Speech-to-text for hands-free use |

---

## Safety Rules

### Crisis Detection

```ts
const CRISIS_KEYWORDS = [
  "emergency", "accident", "help me", "stuck", "injured",
  "crime", "robbery", "ambulance", "police", "fire",
  "medical", "heart attack", "stroke", "bleeding",
  "kidnapping", "exploitation", "trafficking",
  "I need help in Mexico", "ayuda", "emergencia", "accidente",
];

// On crisis detection:
// 1. Zero commerce/partners
// 2. Show official emergency numbers (911 MX, 911 US)
// 3. Show nearest hospital/clinic if location available
// 4. Log event for monitoring
```

### Content Filtering

- No medical advice (link to professionals)
- No legal advice (link to immigration lawyers)
- No smuggling/contraband assistance
- No political opinions on immigration policy
- Always link to official CBP/BMWMM sources for authoritative info

---

## Open Questions (Resolved)

| Question | Answer |
|----------|--------|
| LLM provider | Claude (Anthropic) for quality; GPT-4o-mini fallback for cost |
| Rate limiting | Start with 50 messages/user/day, adjust based on usage |
| Context window | Last 10 messages + trip context + live data per request |
| Offline behavior | Template responses only (Tier 1) when no connectivity |
| Voice | Defer to Phase 4+ |
| Multilingual | Claude natively supports ES/EN; no translation layer needed |
| Cost | Budget ~$0.01-0.03 per message (GPT-4o-mini) or $0.03-0.10 (Claude Haiku) |

## Remaining Open Questions

1. **Streaming:** Should responses stream token-by-token, or wait for full response?
2. **Message storage:** Keep full conversation history, or trim after X messages?
3. **User feedback:** Add thumbs up/down on responses for quality tracking?
4. **Proactive suggestions:** Should the agent proactively suggest things based on wait times? (e.g., "Your crossing usually gets busy at 5pm")
