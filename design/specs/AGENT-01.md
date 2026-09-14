# AGENT-01 — Agent Live Context Contract
**Version:** 1.0 — 2026-09-11 — initial spec.

> **Canonical:** `design/workflows/W6-active-trip.md` — source of truth for active trip state.

# AGENT-01. Agent Live Context

## Purpose

Defines how the Agent consumes live operational intelligence from LIVE-01 and Avisos from AV-01. Replaces the stub `getAgentContext()` with a real context aggregation that provides the Agent with current trip state, crossing status, freshness, and unread notifications.

## Architecture

```text
LiveCrossingStore (LIVE-01)     AvisosStore (AV-01)
         │                              │
         ▼                              ▼
   useAgentLiveContext()
         │
         ▼
   AgentContext
         │
         ├── AgentProvider (processMessage)
         ├── AgentChat (greeting, suggestions)
         └── agent-templates (response generation)
```

## Data types

```typescript
interface AgentLiveContext {
  // Trip identity
  origin: string | null;
  destination: string | null;
  direction: TripDirection | null;
  travelMode: string | null;

  // Selected crossing
  selectedCrossingId: string | null;
  selectedCrossingName: string | null;

  // Live crossing intelligence
  crossingStatus: "open" | "limited" | "closed" | null;
  crossingWaitTime: number | null;
  crossingFreshness: CrossingFreshness | null;

  // Avisos
  unreadAvisoCount: number;
  latestAviso: Aviso | null;

  // Computed
  hasActiveTrip: boolean;
  hasLiveCrossingData: boolean;
}
```

## Source mapping

| Field | Source | Notes |
|-------|--------|-------|
| `origin` | `TripState.start.name` | From trip setup |
| `destination` | `TripState.destination.name` | From trip setup |
| `direction` | `TripState.direction` | MX_TO_US or US_TO_MX |
| `travelMode` | `TripState.travelMode` | walking, privateVehicle, commercial |
| `selectedCrossingId` | `TripState.recommendedCrossing.crossingId` | Committed selection |
| `selectedCrossingName` | `TripState.recommendedCrossing.crossingName` | Committed selection |
| `crossingStatus` | `LiveCrossingSnapshot.status` | Live operational state |
| `crossingWaitTime` | `LiveCrossingSnapshot.waitTime` | Live wait time |
| `crossingFreshness` | `LiveCrossingSnapshot.freshness` | Data quality |
| `unreadAvisoCount` | `AvisosStore.unreadCount()` | Unread notifications |
| `latestAviso` | `AvisosStore.activeAvisos()[0]` | Most recent aviso |
| `hasActiveTrip` | Derived | `start !== null && destination !== null` |
| `hasLiveCrossingData` | Derived | `snapshot !== null` |

## Hook API

```typescript
function useAgentLiveContext(): AgentLiveContext
```

Aggregates from `useTripStore`, `useLiveCrossingStore`, and `useAvisosStore`. Returns a snapshot of the current context.

## Integration points

### 1. Agent greeting

When the Agent mounts with an active trip and live crossing data, the greeting includes current status:

```text
"Tu cruce San Ysidro está abierto con 35 min de espera."
```

### 2. Response context

`generateResponse()` receives `AgentLiveContext` as part of `TemplateContext`, enabling responses like:

- "El tiempo de espera en tu cruce seleccionado aumentó de 20 a 35 min."
- "Hay 2 avisos nuevos para tu viaje."
- "Tu cruce está cerrado. ¿Quieres que busque alternativas?"

### 3. Suggested prompts

When live context is available, the Agent suggests relevant prompts:

- "¿Cómo está el cruce ahora?"
- "¿Hay avisos para mi viaje?"
- "¿Qué alternativas hay?"

## Invariants

1. Agent never fetches crossing data independently — uses `LiveCrossingStore`
2. Agent never mutates `TripState` or `LiveCrossingStore`
3. Context is read-only — Agent consumes, never produces live data
4. `getAgentContext()` replaces the stub with real aggregation
5. Context is re-evaluated on each `processMessage()` call (not cached)

## File structure

```text
lib/agent-context.ts              AgentLiveContext type + getAgentContext()
hooks/useAgentLiveContext.ts      React hook aggregating from stores
lib/__tests__/agent-context.test.ts  Tests
```

---

## File Reference
- Spec doc: `design/specs/AGENT-01.md` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
