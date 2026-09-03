# CRUZE — Product, UX & Design System Specification
## Border Intelligence App · Architecture v2.0 (Implemented)

---

## 0. Product Principle

Cruze answers one fundamental question:

> **"Given where I am, where I'm going, and how I'm crossing, what should I do?"**

The product is a **border-intelligence system** with three primary interfaces:

| Surface | User Question | Tab |
|---------|---------------|-----|
| **Viaje** | "What should I do for my trip?" | 1 |
| **Cruces** | "What is happening at the border right now?" | 2 |
| **Agente** | "Tell me what I need to know or do." | 3 |

Everything else supports these three surfaces.

---

## 1. Core Architectural Decision: Location First

### 1.1 Location is a Prerequisite

Cruze establishes the user's location before presenting personalized border intelligence.

The initial application flow is:

```
APP LAUNCH
    ↓
LOCATION INITIALIZATION
    ↓
LOCATION READY
    ↓
CRUZE HOME (Viaje)
    ├── Viaje
    ├── Cruces
    └── Agente
```

Location is not a Trip-specific feature — it's an application-level context required by the intelligence layer.

---

## 2. Location State Machine

Location acquisition is treated as a robust state machine:

```
APP LAUNCHED
    ↓
INITIALIZING
    ↓
REQUESTING PERMISSION
    ↓
         ┌─────────────┴─────────────┐
         ↓                           ↓
   PERMISSION GRANTED          PERMISSION DENIED
         ↓                           ↓
   ACQUIRING LOCATION         EXPLAIN / RETRY
         ↓
   VALIDATING LOCATION
         ↓
    ┌────┴─────┐
    ↓           ↓
LOW CONFIDENCE  READY
    ↓           ↓
REFINE/RETRY  CRUZE HOME
```

### Location Semantic States

The application exposes simple semantic states (not raw GPS):

| State | Meaning |
|-------|---------|
| `Location unavailable` | No permission / services disabled |
| `Location being determined` | Acquiring GPS |
| `Location needs confirmation` | Low confidence / ambiguous |
| `Location ready` | Validated, usable |
| `Location needs refreshing` | Stale (>12h) |

---

## 3. Location Gate UX

### First Launch

**Title**: `¿Dónde estás?`

**Explanation**: `Cruze usa tu ubicación para mostrarte los cruces más relevantes, sus tiempos actuales y las mejores opciones para llegar a ellos.`

**Primary Action**: `Permitir ubicación`

**Secondary**: `Configuración`

The user is never dumped into an empty app if permission fails.

---

## 4. Post-Location Experience

Once location is ready, the user lands directly in **Viaje** with immediate intelligence:

```
CRUZE
────────────────────────────

TU VIAJE

¿A dónde vas?

[ Comenzar un viaje ]

────────────────────────────

CERCA DE TI

Cruces relevantes ahora

[ Crossing A ]
[ Crossing B ]
[ Crossing C ]

Ver todos los cruces →
```

This is the canonical first-use experience.

---

## 5. Nearby Crossing Intelligence

The initial Trip screen shows **2–3 crossings maximum** — not a directory reproduction.

**Ranking Formula**:
```
RELEVANCE =
    proximity
  + estimated travel time
  + current wait
  + operational status
  + data freshness
  + travel mode compatibility
  + access compatibility
  + route usefulness
```

**Nearby Preview Card** shows:
- Crossing name
- Operational status (● OPEN / LIMITED / CLOSED)
- Current wait time
- Direction
- Estimated travel time from current location
- Freshness (e.g., "Actualizado hace 2 min")

---

## 6. Navigation Flow

### Crossing Detail → Trip

Selecting a nearby crossing does **not** create a Trip automatically.

```
Viaje
  ↓
Nearby Crossing
  ↓
Crossing Detail
```

Crossing Detail offers:
- `Navegar` (handoff to maps)
- `Usar este cruce` → enters Trip Setup
- `Comparar`
- `Guardar`
- `Preguntar al Agente`

Only **Usar este cruce** enters Trip planning.

---

## 7. Information Architecture

```
CRUZE
│
├── VIAJE
│   ├── Empty / Nearby Intelligence
│   ├── Trip Setup (adaptive)
│   ├── Recommendation
│   ├── Active Trip
│   └── Completed Trip
│
├── CRUCES
│   ├── Directory
│   ├── Search / Filters
│   ├── Crossing Detail
│   ├── Compare
│   └── Contextual Map
│
├── AGENTE
│   ├── Welcome
│   ├── Conversation
│   └── Contextual Results
│
├── AVISOS
│   ├── Updates
│   └── Aviso Detail
│
└── SETTINGS
    ├── Profile
    ├── Favorites
    ├── My Trips
    ├── Data Sharing
    └── About
```

---

## 8. Primary Navigation

### Bottom Nav (5 tabs — Invariant)
```
Viaje | Cruces | Agente | Favoritos | Alertas
```

**Invariants:**
1. Exactly three primary tabs: Viaje, Cruces, Agente (Favoritos/Alertas are secondary)
2. Bell always → Avisos
3. Gear always → Configuración
4. Crossing always resolves to canonical Crossing Detail
5. Map never becomes a 4th primary destination
6. Favorites never becomes a primary destination
6. Completed trips belong in My Trips; active trips in Viaje

---

## 9. Global Header (TopAppBar)

### Variants

| Variant | Used By | Elements |
|---------|---------|----------|
| `root` | Viaje, Favoritos, Alertas, Agente | App name + MX\|USA + dropdown (3-dots) |
| `search` | Cruces | Search input |

### Header Components
- **App Name**: "CRUZE" (uppercase, tracking-wider)
- **Country Indicator**: MX \| USA (geolocation-based, next to app name)
- **Dropdown Menu** (3-dots): End Trip, Configure, Navigate, View Crossing
- **Live Indicator** (root): `● LIVE` with freshness

### Dropdown Menu (Trip Context)
When a trip is active:
- `End Trip` → resets trip, goes to configure
- `Configure` → `/viaje/configure`
- `Navigate` → handoff to maps
- `View Crossing` → `/crossing/{id}`

---

## 10. Bottom Navigation

### 5 Tabs (Fixed)
```
Viaje | Cruces | Agente | Favoritos | Alertas
```

| Tab | Route | Active Indicator |
|-----|-------|------------------|
| Viaje | `/viaje` | Mint underline |
| Cruces | `/crossings` | Mint underline |
| Agente | `/agent` | Mint underline |
| Favoritos | `/favorites` | Mint underline |
| Alertas | `/alerts` | Mint underline |

---

## 11. Settings

Deliberately minimal — exactly 5 areas:

```
CONFIGURACIÓN
    ├── PERFIL
    │   └── Perfil
    ├── GUARDADOS
    │   ├── Favoritos
    │   └── Mis viajes
    ├── PRIVACIDAD
    │   └── Compartir datos
    └── INFORMACIÓN
        └── Acerca de Cruze
```

- No account system
- No authentication required
- Profile is local only
- "Compartir datos" explicitly marked **Próximamente** (no fake controls)

---

## 12. Trip Architecture

### Trip Setup = Adaptive Workflow (Not Fixed Steps)

**Base Requirements** (every trip):
```
Destination
Origin (defaults to current location)
Travel Mode
```

**Branching by Mode**:

```
TRAVEL MODE
    │
    ├─ A PIE (Walking) → Destination → Origin → Recommendation
    ├─ VEHÍCULO PRIVADO (Private)
    │    └─ Direction?
    │         ├─ Southbound → Recommendation
    │         └─ Northbound → Access Type → Document Profile → Recommendation
    └─ COMERCIAL → Filter compatible crossings → Recommendation
```

**Direction Detection**: Derived from origin/destination. Only ask if ambiguous.

### Northbound Private — Access Type
```
¿Cómo cruzas normalmente?
○ Cruce estándar
○ Ready Lane
○ SENTRI / Global Entry
○ No estoy seguro
```

### Northbound Private — Document Profile (Optional)
```
¿Qué tipo de documentación tienes?
○ Pasaporte / documento de viaje
○ Visa
○ Ciudadanía / residencia de EE. UU.
○ Programa de viajero confiable
○ No estoy seguro

> Esta información ayuda a filtrar recomendaciones. No determina tu elegibilidad legal.
```

---

## 13. Trip Recommendation

### Structure
```
MEJOR CRUCE PARA TU VIAJE

San Luis

● ABIERTO

11 min          2h 14m
Espera          Total

¿Por qué?
• Menor tiempo total
• Compatible con tu tipo de cruce
• Datos recientes

[ Usar este cruce ]

Comparar alternativas
```

### Semantic Labels
- **Recomendado** (preferred)
- **Más rápido** (if distinct from recommended)
- **Alternativa** (others)

---

## 14. Alternatives

**Deliberately limited** — show tradeoff immediately:

```
OTRAS OPCIONES

Lukeville      18 min    +17 min total
Nogales Mariposa  24 min   +48 min total
```

---

## 15. Active Trip (Execution Surface)

```
MI VIAJE
Puerto Peñasco → Los Angeles

CRUCE RECOMENDADO
San Luis
11 min
8h 35m total

[ Navegar ]  [ Ver cruce ]

────────────────

ANTES DE CRUZAR
✓ Cruce abierto
✓ Datos recientes
○ Revisar documentación
○ Revisar restricciones
```

### Trip Actions (Priority Order)
1. `Navegar` (primary — handoff to maps)
2. `Ver cruce` (secondary — Crossing Detail)
3. `Comparar` (tertiary)
4. `Configurar viaje`
5. `Preguntar al Agente`
6. `Finalizar viaje` (overflow/secondary)

---

## 16. Pre-Crossing Checklist (Data-Driven)

| Category | Source |
|----------|--------|
| Operational | Crossing status (OPEN/LIMITED/CLOSED) |
| Data freshness | CBP timestamp |
| Route availability | Traffic + restrictions |
| Access compatibility | User profile vs crossing access |
| Required documentation | CBP rules + user profile |
| Restrictions | CBP restrictions |
| Lane availability | Live lane data |

**Never invent legal requirements** — only surface authoritative rules.

---

## 17. Crossings Directory

### Purpose
**Trip = personalized recommendation**  
**Cruces = live border visibility**

Directory is denser, more information-oriented.

### Layout
```
CRUCES

[ Buscar cruces... ]

Todos   México   EE. UU.

────────────

San Luis
● Abierto
Norte 11 min    Sur 5 min

Lukeville
● Abierto
Norte 18 min    Sur 8 min

Nogales Mariposa
● Abierto
Norte 24 min    Sur 12 min
```

### Filters
- **Country**: Todos | México | EE. UU.
- **Mode**: Auto | A pie | Comercial
- **Sort**: Más relevantes | Más rápidos | Más cercanos | Nombre (default: relevance)

### Row Data (Collapsed)
```
Crossing Name | Status ● | Northbound Wait | Southbound Wait
```

### Expanded State
- Lane information with eligibility
- Access types
- Hours
- Services
- Restrictions
- "Start Trip" CTA

---

## 18. Crossing Detail (Canonical)

All routes converge here:
```
Trip → Crossing Detail
Cruces → Crossing Detail
Agent → Crossing Detail
Avisos → Crossing Detail
Favorites → Crossing Detail
```

### Layout
```
← Cruces

SAN LUIS                    ☆

[ MAP ]

● ABIERTO
11 min   Norte
Actualizado hace 2 min
────────────────

TIEMPOS POR CARRIL
Standard       11 min
Ready Lane      7 min
SENTRI           3 min

────────────────

ACCESO
Auto  A pie  ...

────────────────

HORARIOS
...

────────────────

REQUISITOS
...

────────────────

RESTRICCIONES
...

────────────────

SERVICIOS
...

[ Usar este cruce ]
```

---

## 19. Operational State vs Data Freshness

**Never combine them.**

### Operational State
```
OPEN | LIMITED | CLOSED | UNKNOWN
```

### Data Freshness
```
LIVE (0–5 min) | RECENT (5–20 min) | STALE (20–60 min) | VERY_STALE (60+ min) | UNAVAILABLE
```

### Display Examples
```
● ABIERTO          ● ABIERTO
Datos recientes    Datos desactualizados
Actualizado 3 min  Actualizado 58 min
```

**Never**: `EN VIVO` with stale data.

---

## 20. Crossing Requirements

Progressive disclosure:

```
REQUISITOS

Documentación [ Expand ]
Acceso        [ Expand ]
Vehículos     [ Expand ]
Restricciones [ Expand ]
```

---

## 21. Compare

Contextual entry points: Recommendation, Crossing Detail, Cruces.

**Metrics**:
```
Crossing    Wait    Travel Time    Total    Distance    Status    Access    Freshness
San Luis    11 min  8h 35m         8h 46m   168 km      Abierto   ✓         2 min
Lukeville   18 min  8h 52m         9h 10m   181 km      Abierto   ✓         3 min
```

Winning option visually apparent.

---

## 22. Map

**Not a primary destination** — contextual only.

Entry points: Trip, Cruces, Crossing Detail, Navigation, Agent.

---

## 23. Agent (Conversational Intelligence)

### Purpose
Not a chatbot tab — **conversational interface to Cruze's intelligence**.

### Context Awareness
- Current location
- Current crossing
- Current trip
- Trip direction
- Travel mode
- Profile
- Recommendation
- Recent Avisos
- Checklist state

### Examples
| Context | Query |
|---------|-------|
| None | "¿Qué cruces están disponibles?" |
| Trip | "¿Sigue siendo San Luis la mejor opción?" |
| Aviso | "¿Por qué cambió mi recomendación?" |
| Near border | "¿Qué debería revisar antes de cruzar?" |
| Active trip | "¿Hay algún cambio en mi cruce?" |
| Post-crossing | "¿Quieres guardar este viaje?" |

### Structured Results
- `AgentCrossingResult` (crossing card)
- `AgentRecommendationResult` (recommendation + actions)
- `AgentTripAction` (navigate, review, finish)
- `AgentChecklistResult` (checklist)

---

## 24. Avisos

**User term**: `Avisos` (not "Alerts")

### Bell
Globally accessible, unread badge.

### Types
| Type | Example |
|------|---------|
| Crossing changed | "Tu recomendación cambió — San Luis ya no es la mejor opción" |
| Recommendation changed | "Ahora: Lukeville, 14 min más rápido" |
| Crossing closed | — |
| Wait increased | "San Luis · +12 min" |
| Wait decreased | — |
| Trip reminder | — |
| Checklist reminder | "Estás cerca de San Luis. ¿Revisar checklist?" |
| Data warning | — |
| Unusual border condition | — |

### Aviso → Agent Complementarity
- Avisos surface the event
- Agent can explain it

---

## 25. Favorites

Under Settings (not primary nav):
```
CONFIGURACIÓN → FAVORITOS
San Luis
Lukeville
Nogales Mariposa
```

Also accessible from Crossing Detail.

---

## 26. My Trips

```
CONFIGURACIÓN → MIS VIAJES
```

Only **completed** trips appear:
```
Puerto Peñasco → Los Angeles
San Luis
Completado — 26 Ago 2026
```

Active/draft trips stay in Viaje.

---

## 27. Design System (Implemented)

### Color Tokens (globals.css @theme)
```css
/* Base */
--color-midnight: #071A31;
--color-background: #071A31;
--color-surface: #0E223F;
--color-surface-elevated: #132B4A;
--color-border: #1F3A5A;
--color-text-primary: #F5F7FA;
--color-text-secondary: #A7B3CC;

/* Semantic Aliases */
--color-ink: #F5F7FA;
--color-faint: #A7B3CC;
--color-muted: #6B7D99;

/* Brand */
--color-cruze-mint: #00E0A0;
--color-amber: #FFB020;
--color-alert-red: #FF4D4F;
--color-info-blue: #3BA7FF;

/* Status */
--color-improving: #22924A;
--color-caution: #F4A01B;
--color-critical: #E33332;
--color-info: #2E9DD6;

/* Soft variants for badges */
--color-improving-soft: #143E32;
--color-caution-soft: #44351A;
--color-critical-soft: #421D26;
--color-info-soft: #152F43;
```

### Semantic Usage Rules
| Color | Represents |
|-------|------------|
| Mint (`cruze-mint`) | Primary action, active selection, OPEN, recommendation, positive delta |
| Amber | Warning, STALE, LIMITED, deltas (tradeoffs) |
| Red (`alert-red`) | CLOSED, critical, destructive, blocked |
| Blue | Informational, geographic/navigation |

### Status Badges
| Status | Color | Soft Variant |
|--------|-------|--------------|
| OPEN | `bg-improving` / `text-improving` | `bg-improving-soft text-improving` |
| LIMITED | `bg-caution` / `text-caution` | `bg-caution-soft text-caution` |
| CLOSED | `bg-critical` / `text-critical` | `bg-critical-soft text-critical` |

### Active Filter Pill (Fixed)
```css
/* Before (invisible) */
.bg-cruze-green.text-background

/* After (visible) */
.bg-cruze-mint.text-midnight
```

### Typography
| Font | Use For |
|------|---------|
| **Sora** | Hero headings, display numbers, major recommendations, crossing names |
| **Inter** | Body text, navigation, labels, metadata, controls, secondary info |

### Spacing (4px base)
```css
--spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 12px;
--spacing-lg: 16px; --spacing-xl: 24px; --spacing-2xl: 32px;
```

### Radius
```css
--radius-sm: 6px;      /* Controls */
--radius-md: 10px;     /* Cards, buttons */
--radius-lg: 16px;     /* Panels */
--radius-full: 9999px; /* Pills */
```

### Touch Targets
**Minimum 44–48px** for all interactive elements.

---

## 28. Component Naming Convention

**Pattern**: `Domain + Surface + Responsibility`

| ❌ Avoid | ✅ Use |
|----------|--------|
| `Card` | `TripRecommendationPrimaryCard` |
| `Panel` | `CrossingDetailLaneSection` |
| `Item` | `CrossingDirectoryRow` |
| `Widget` | `TripAlternativeListRow` |

**Pattern**: `<DOMAIN>-<SURFACE>-<RESPONSIBILITY>`
| Prefix | Domain |
|--------|--------|
| `APP` | Application shell |
| `LOC` | Location |
| `TR` | Trip |
| `CR` | Crossings |
| `AG` | Agent |
| `AV` | Avisos |
| `SET` | Settings |

---

## 29. Screen Inventory (Implemented)

| Ref | Page | Route | Status |
|-----|------|-------|--------|
| L01 | Location Permission | `/onboarding` | ✅ |
| L02 | Location Acquisition | — | ✅ |
| L03 | Location Recovery | — | ✅ |
| T01 | Trip Empty / Nearby | `/viaje` | ✅ |
| T02 | Destination | `/onboarding/destination` | ✅ |
| T03 | Origin | `/onboarding/starting-point` | ✅ |
| T04 | Travel Mode | `/onboarding/starting-point` | ✅ |
| T05 | Vehicle Access | `/onboarding/starting-point` | ✅ |
| T06 | Document Profile | `/onboarding/starting-point` | ✅ |
| T07 | Recommendation | `/onboarding/recommendation` | ✅ |
| T08 | Active Trip | `/viaje` | ✅ |
| C01 | Crossings Directory | `/crossings` | ✅ |
| C02 | Search/Filter | `/crossings` | ✅ |
| C03 | Crossing Detail | `/crossing/[id]` | ⚠️ Partial |
| C04 | Compare | — | ⏳ |
| A01 | Agent Welcome | `/agent` | ✅ |
| A02 | Agent Conversation | `/agent` | ✅ |
| N01 | Avisos | `/alerts` | ✅ |
| S01 | Settings | — | ⏳ |

---

## 30. Implementation Status (v2.0)

| Area | Status | Notes |
|------|--------|-------|
| Unified Navigation | ✅ | 7 commits |
| Design Tokens | ✅ | globals.css @theme |
| Component Library | Partial | Core components done |
| Pages Unified | ✅ | All main pages use MainLayout |
| Agent Input Fixed | ✅ | Above bottom nav |
| Crossings Filter | ✅ | Default MX, visible pills |
| Trip View | ✅ | BestCrossingCard + alternatives |
| TypeScript | ✅ | 0 errors |

---

*Updated: 2026-09-02 | v2.0 | Based on 7 atomic commits*