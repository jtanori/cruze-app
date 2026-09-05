# CRUZE — Product, UX & Design System Specification
> **⚠️ SUPERSEDED FOR IMPLEMENTATION — Source of truth:** `design/components/<ID>-<Name>.md` (see `design/components/README.md` — 83 specs) + `design/workflows/W*.md` (W1-W10) + `design/workflows/W5_component_level_design_spec.md` (tokens) + `design/INTEGRATION_PLAN.md` Addendum.
> This document remains **product rationale / decision freeze only** (§104-105). Do not implement directly from it.


### Border Intelligence App · Revised Architecture v2

---

# 0. Product Principle

Cruze answers one fundamental question:

> **“Given where I am, where I’m going, and how I’m crossing, what should I do?”**

The product should not behave like a generic travel app, a border directory, or a chatbot.

It is a **border-intelligence system** with three primary interfaces:

| Surface | User question |
|---|---|
| **Viaje** | “What should I do for my trip?” |
| **Cruces** | “What is happening at the border right now?” |
| **Agente** | “Tell me what I need to know or do.” |

Everything else supports these three surfaces.

---

# 1. Core Architectural Decision: Location First

## 1.1 Location is a Cruze prerequisite

Cruze should establish the user's location before presenting personalized border intelligence.

The initial application flow is:

```text
APP LAUNCH
    ↓
LOCATION INITIALIZATION
    ↓
LOCATION READY
    ↓
CRUZE HOME
    ├── Viaje
    ├── Cruces
    └── Agente
```

Location is not a Trip-specific feature.

It is an application-level context required by the intelligence layer.

---

# 2. Location State Machine

Location acquisition must be treated as a robust state machine rather than a single permission prompt.

```text
                    ┌───────────────┐
                    │ APP LAUNCHED  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ INITIALIZING  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ REQUESTING    │
                    │ PERMISSION    │
                    └───────┬───────┘
                            ↓
                 ┌──────────┴──────────┐
                 ↓                     ↓
          PERMISSION GRANTED     PERMISSION DENIED
                 ↓                     ↓
          ACQUIRING LOCATION     L03 RECOVERY
                 ↓                     ↓
          VALIDATING LOCATION    ┌─────────────┐
                 ↓               │ MANUAL      │
        ┌────────┴─────────┐     │ SEARCH      │
        ↓                  ↓     └──────┬──────┘
   LOW_CONFIDENCE       READY           ↓
        ↓                  ↓       USER SELECTS
  REFINE / RETRY       CRUZE HOME       ↓
                                   GEOCODING API
                                        ↓
                                        READY
```

## 2.1 Location states

```text
UNINITIALIZED
REQUESTING_PERMISSION
PERMISSION_DENIED
MANUAL_SEARCH
SERVICES_DISABLED
ACQUIRING
LOW_CONFIDENCE
READY
STALE
UNAVAILABLE
```

## 2.2 Location confidence

A successful GPS response is not automatically a usable location.

Cruze should evaluate:

- coordinate validity
- accuracy radius
- timestamp
- whether the position can meaningfully determine a border region
- whether the user is moving
- whether the location is stale

The application should expose a simple semantic state:

```text
Location unavailable
Location being determined
Location needs confirmation
Location ready
Location needs refreshing
```

Technical GPS details should not normally be exposed.

---

# 3. Location Gate UX

## 3.1 First launch

The first meaningful screen should explain why Cruze needs location.

### Content

**Title**

> ¿Dónde estás?

**Explanation**

> Cruze usa tu ubicación para mostrarte los cruces más relevantes, sus tiempos actuales y las mejores opciones para llegar a ellos.

Primary action:

> **Permitir ubicación**

Secondary action:

> Configuración

The user should not be dumped into an empty application if location permission fails.

## 3.2 Manual Location Search

When GPS permission is denied or unavailable, users can manually search for their location.

### Content

**Title**

> No se pudo obtener tu ubicación por GPS.

**Search Input**

> 🔍 Buscar ubicación...

**Constraints**

- Limited to MX and USA locations
- Suggestions powered by geocoding API (Mapbox)
- Results limited to 5 suggestions

**Actions**

- User types location → API returns suggestions
- User selects suggestion → coordinates obtained → READY state
- Alternative: Reintentar GPS

### Persistence

Manual location is saved for future visits but GPS is preferred when available.

```text
IF GPS available AND permission granted:
    USE GPS location (default)

ELSE IF manual location selected:
    USE manual location
    MARK as manual in store
```

### Network Dependency

Manual search requires network connectivity. If offline:

```text
┌─────────────────────────────────────┐
│                                     │
│     Sin conexión a internet         │
│                                     │
│     La búsqueda de ubicación        │
│     requiere conexión.              │
│                                     │
│     [ Reintentar GPS ]              │
│                                     │
└─────────────────────────────────────┘
```

---

# 4. What Happens Once Location Is Ready

The user lands directly in **Viaje**.

However, Viaje is not empty.

It immediately demonstrates Cruze's intelligence.

```text
CRUZE
────────────────────────────────

TU VIAJE

¿A dónde vas?

[ Comenzar un viaje ]

────────────────────────────────

CERCA DE TI

Cruces relevantes ahora

[ Crossing A ]
[ Crossing B ]
[ Crossing C ]

Ver todos los cruces →
```

This is the canonical first-use experience.

---

# 5. Nearby Crossing Intelligence

The initial Trip screen should show only a **small number of crossings**.

Recommended:

> **2–3 crossings maximum**

The objective is not to reproduce the Crossings directory.

It is to answer:

> “What does the border look like around me right now?”

## 5.1 Ranking

Do not simply sort geographically.

The backend/intelligence layer should calculate:

```text
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

The actual formula can evolve independently of the UI.

## 5.2 Nearby preview card

Each item should communicate:

- crossing name
- operational status
- current wait
- direction
- estimated travel time from current location
- freshness

Example:

```text
San Luis

● Abierto

11 min          2h 14m
Norte           Desde tu ubicación

Actualizado hace 2 min
```

Do not overload this card with:

- full lane information
- document requirements
- hours
- services
- address
- map
- detailed restrictions

Those belong to Crossing Detail.

---

# 6. Nearby Crossing → Crossing Detail

Selecting a nearby crossing should **not create a Trip automatically**.

The user is expressing:

> “I want to know about this crossing.”

Therefore:

```text
Viaje
  ↓
Nearby Crossing
  ↓
Crossing Detail
```

Crossing Detail then offers:

```text
Navegar
Usar este cruce
Comparar
Guardar
Preguntar al Agente
```

Only **Usar este cruce** enters Trip planning.

---

# 7. Primary Information Architecture

```text
CRUZE
│
├── VIAJE
│   ├── Empty / Nearby Intelligence
│   ├── Trip Setup
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

# 8. Primary Navigation

The application has exactly three primary destinations.

```text
┌─────────────────────────────────────────┐
│                 CRUZE       🔔   ⚙      │
├─────────────────────────────────────────┤
│                                         │
│              SCREEN CONTENT              │
│                                         │
├─────────────────────────────────────────┤
│       Viaje       Cruces       Agente   │
└─────────────────────────────────────────┘
```

## 8.1 Viaje

Personalized decision surface.

## 8.2 Cruces

Live border reference surface.

## 8.3 Agente

Conversational intelligence surface.

---

# 9. Global Header

The header contains:

```text
CRUZE
                    🔔    ⚙
```

## Components

- `CruzeAppHeader`
- `CruzeNotificationButton`
- `CruzeSettingsButton`

### Notification

User-facing terminology:

> **Avisos**

Technical model may remain:

```text
Alert
```

The bell should display an unread badge when appropriate.

Alerts/Avisos are intentionally **not a navigation destination**.

---

# 10. Settings

Settings are deliberately small.

```text
CONFIGURACIÓN

PERFIL
Perfil

GUARDADOS
Favoritos
Mis viajes

PRIVACIDAD
Compartir datos

INFORMACIÓN
Acerca de Cruze
```

Exactly five areas:

1. Profile
2. Favorites
3. My Trips
4. Data Sharing
5. About

No account system is implied.

No authentication is required.

No organization model is required.

The profile is local.

---

# 11. Profile

The local profile stores information useful for recommendations.

Potential fields:

```text
Travel Mode
Access Type
Document Category
Trusted Traveler Program
```

Only information with actual recommendation value should be collected.

No document numbers.

No passport numbers.

No credential storage.

---

# 12. Trip Architecture

Trip is not onboarding.

The previous “Onboarding” screens should be reclassified as:

> **Trip Setup**

This means there is no separate conceptual onboarding product.

The user can enter Trip Setup:

- from Viaje
- from Crossing Detail
- from Agent
- from another contextual action

---

# 13. Trip Lifecycle

```text
DRAFT
  ↓
PLANNING
  ↓
READY
  ↓
ACTIVE
  ↓
AT_BORDER
  ↓
COMPLETED
```

Only:

> `COMPLETED`

trips are eligible for My Trips.

---

# 14. Trip Setup Controller

Trip Setup should be dynamic.

Do not implement:

```text
OnboardingStep1
OnboardingStep2
OnboardingStep3
...
```

Instead implement a workflow controller:

```text
TripSetupFlow
```

which determines the necessary steps from context.

---

# 15. Trip Setup — Base Flow

Every trip needs:

```text
Destination
Origin
Travel Mode
```

Location already exists, so Origin should initially default to:

> **Mi ubicación actual**

The user can override it.

---

# 16. Travel Mode Branching

```text
                  TRAVEL MODE
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       A PIE        VEHÍCULO      COMERCIAL
                     PRIVADO        / TRUCK
          │            │            │
          ↓            ↓            ↓
      Recommend     Northbound?   Compatible
      directly          │         crossings
                         │              ↓
                  ┌──────┴──────┐   Recommend
                  ↓             ↓
               SOUTHBOUND   NORTHBOUND
                  │             │
                  ↓             ↓
              Recommend       Access
                                ↓
                           Documents
                                ↓
                           Recommend
```

---

# 17. Walking Flow

Walking is intentionally minimal.

```text
Destination
    ↓
Origin
    ↓
Walking
    ↓
Recommendation
```

Do not ask:

- passport details
- vehicle type
- lane preference
- trusted traveler program
- unnecessary profile questions

Pedestrian crossings are sufficiently constrained that Cruze should simply recommend the useful options.

---

# 18. Commercial / Truck Flow

Commercial travel is similarly constrained.

```text
Destination
    ↓
Origin
    ↓
Commercial
    ↓
Filter compatible crossings
    ↓
Recommendation
```

Do not ask questions unless the answer can actually change the eligible crossing set.

---

# 19. Private Vehicle Flow

Private vehicles are where Cruze earns the most from contextual profiling.

```text
Destination
    ↓
Origin
    ↓
Private Vehicle
    ↓
Determine Direction
    ↓
If Southbound
    ↓
Recommendation

If Northbound
    ↓
Access Type
    ↓
Document Profile
    ↓
Recommendation
```

---

# 20. Direction Detection

Direction should normally be derived.

Do not ask:

> “¿Vas hacia México o Estados Unidos?”

if origin and destination make the direction obvious.

Only ask when:

- origin is ambiguous
- destination is ambiguous
- the route crosses multiple border regions
- geospatial inference is insufficient

Then provide:

> ¿Hacia dónde vas?

with:

- México
- Estados Unidos

---

# 21. Private Vehicle — Access Type

For northbound private travel:

```text
¿Cómo cruzas normalmente?

○ Cruce estándar
○ Ready Lane
○ SENTRI / Global Entry
○ No estoy seguro
```

This information is used to filter recommendations.

It is not a legal eligibility determination.

---

# 22. Private Vehicle — Document Profile

This should be optional and deliberately high-level.

Example:

```text
¿Qué tipo de documentación tienes?

○ Pasaporte / documento de viaje
○ Visa
○ Ciudadanía / residencia de EE. UU.
○ Programa de viajero confiable
○ No estoy seguro
```

Do not request document identifiers.

The interface should explicitly communicate:

> Esta información ayuda a filtrar recomendaciones. No determina tu elegibilidad legal para ingresar al país.

---

# 23. Trip Recommendation

Recommendation is the climax of Trip Setup.

It should answer:

> “Why this crossing?”

Not merely:

> “This crossing has 11 minutes.”

Structure:

```text
MEJOR CRUCE PARA TU VIAJE

San Luis

● Abierto

11 min
Tiempo de espera

2h 14m
Tiempo estimado de viaje

¿Por qué?

• Menor tiempo total
• Compatible con tu tipo de cruce
• Datos recientes

[ Usar este cruce ]

Comparar alternativas
```

---

# 24. Recommendation Ranking

Possible semantic labels:

```text
RECOMMENDED
FASTEST
BEST_OVERALL
ALTERNATIVE
```

Do not show multiple competing badges simultaneously unless there is a clear reason.

Preferred:

> **Recomendado**

Then explain why.

---

# 25. Alternative Crossings

Alternatives should be deliberately limited.

Example:

```text
OTRAS OPCIONES

Lukeville
18 min
+17 min total

Nogales Mariposa
24 min
+48 min total
```

The user should immediately understand the tradeoff.

---

# 26. Active Trip

Active Trip is different from the recommendation screen.

Its purpose is:

> Help me execute the decision.

Structure:

```text
MI VIAJE

Puerto Peñasco
      ↓
Los Angeles

CRUCE RECOMENDADO

San Luis
11 min

8h 35m total

[ Navegar ]

[ Ver cruce ]

────────────────────

ANTES DE CRUZAR

✓ Cruce abierto
✓ Datos recientes
○ Revisar documentación
○ Revisar restricciones
```

The checklist becomes a real Cruze feature.

---

# 27. Pre-Crossing Checklist

The checklist should be data-driven.

Potential categories:

```text
Operational
Data freshness
Route availability
Access compatibility
Required documentation
Restrictions
Lane availability
```

The actual requirements must come from Cruze's crossing data and authoritative rules.

The checklist must never invent legal requirements.

---

# 28. Trip Contextual Actions

From Active Trip:

```text
Navegar
Ver cruce
Comparar
Configurar viaje
Preguntar al Agente
Finalizar viaje
```

“Finalizar viaje” should be behind a secondary/overflow action rather than visually competing with navigation.

---

# 29. Trip Completion

When the user completes a trip:

```text
VIAJE COMPLETADO

Puerto Peñasco → Los Angeles

Cruce utilizado
San Luis

[ Guardar en Mis viajes ]

[ Listo ]
```

The trip cannot appear in My Trips until it reaches `COMPLETED`.

---

# 30. Crossings Directory

Crossings has a fundamentally different mental model from Trip.

Trip:

> personalized recommendation

Crossings:

> live border visibility

The directory should therefore be denser and more information-oriented.

---

# 31. Crossings Directory Layout

```text
CRUCES

[ Buscar cruces... ]

Todos   México   EE. UU.

Auto   A pie   Comercial

────────────────────────

San Luis
● Abierto

Norte       11 min
Sur          5 min

Lukeville
● Abierto

Norte       18 min
Sur          8 min

Nogales Mariposa
● Abierto

Norte       24 min
Sur         12 min
```

---

# 32. Crossings Filters

Primary filters:

```text
Todos
México
Estados Unidos
```

Contextual filters:

```text
Auto
A pie
Comercial
```

Potential sorting:

```text
Más relevantes
Más rápidos
Más cercanos
Nombre
```

The default should be relevance rather than alphabetical order.

---

# 33. Crossing Directory Row

A row should expose only decision-critical information:

```text
Crossing Name
Operational Status
Northbound Wait
Southbound Wait
```

Expanded state can expose:

```text
Lane information
Access types
Hours
Services
```

---

# 34. Crossing Detail

Crossing Detail is the canonical crossing information surface.

All routes should converge here:

```text
Trip
  ↓
Crossing Detail

Crossings
  ↓
Crossing Detail

Agent
  ↓
Crossing Detail

Avisos
  ↓
Crossing Detail

Favorites
  ↓
Crossing Detail
```

There should be only one canonical Crossing Detail implementation.

---

# 35. Crossing Detail Layout

```text
← Cruces

SAN LUIS

[ MAP ]

● ABIERTO

11 min
Norte

Actualizado hace 2 min

────────────────

TIEMPOS POR CARRIL

Standard       11 min
Ready Lane      7 min
SENTRI           3 min

────────────────

ACCESO

Auto
A pie
...

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

# 36. Operational State vs Data Freshness

This distinction is mandatory.

Never combine them.

## Operational state

```text
OPEN
LIMITED
CLOSED
UNKNOWN
```

## Data freshness

```text
LIVE
RECENT
STALE
UNAVAILABLE
```

Example:

```text
● ABIERTO

Datos recientes
Actualizado hace 3 min
```

or:

```text
● ABIERTO

Datos desactualizados
Actualizado hace 58 min
```

Never:

```text
EN VIVO
Actualizado hace 151 min
```

This was one of the most important semantic issues in the current implementation.

---

# 37. Freshness Rules

Suggested presentation:

```text
0–5 min       LIVE
5–20 min      RECENT
20–60 min     STALE
60+ min       VERY_STALE
No timestamp  UNAVAILABLE
```

Exact thresholds should ultimately be configurable by the data provider.

The UI must use semantic state, not hardcoded visual assumptions.

---

# 38. Crossing Requirements

Requirements should be progressive disclosure.

Do not present a wall of text.

Structure:

```text
REQUISITOS

Documentación
[ Expand ]

Acceso
[ Expand ]

Vehículos
[ Expand ]

Restricciones
[ Expand ]
```

---

# 39. Crossing Compare

Compare is contextual.

Entry points:

- Recommendation
- Crossing Detail
- Crossings directory

Compare only compatible crossings whenever the user has a known travel mode.

For example, commercial users should not be shown irrelevant pedestrian options.

Metrics:

```text
Crossing
Wait
Travel time
Total estimated time
Distance
Operational status
Access compatibility
Data freshness
```

The winning option should be visually apparent.

---

# 40. Map

Map is not a primary navigation destination.

It is contextual.

Entry points:

```text
Trip
Crossings
Crossing Detail
Navigation
Agent
```

Map should support decisions rather than become another standalone product.

---

# 41. Agent

The Agent should not be designed as:

> “a chatbot tab.”

It is:

> **the conversational interface to Cruze's intelligence system.**

It knows contextual information such as:

```text
Current location
Current crossing
Current trip
Trip direction
Travel mode
Profile
Recommendation
Recent Avisos
Checklist state
```

Subject to privacy and data-minimization rules.

---

# 42. Agent Examples

Without context:

> ¿Qué cruces están disponibles?

With trip context:

> ¿Sigue siendo San Luis la mejor opción?

With an Aviso:

> ¿Por qué cambió mi recomendación?

Near the border:

> ¿Qué debería revisar antes de cruzar?

During an active trip:

> ¿Hay algún cambio en mi cruce?

After crossing:

> ¿Quieres guardar este viaje?

---

# 43. Agent UI

```text
AGENTE

Hola. Soy Cruze.

Puedo ayudarte a entender la frontera,
comparar cruces o revisar tu viaje.

[ ¿Qué cruces están disponibles? ]
[ ¿Cuál me conviene más? ]
[ Revisa mi viaje ]
[ ¿Qué debo revisar antes de cruzar? ]

────────────────────────

[ Escribe una pregunta... ]  ↑
```

---

# 44. Agent Result Types

The Agent should return structured UI when possible.

Examples:

```text
AgentCrossingResult
AgentRecommendationResult
AgentTripAction
AgentChecklistResult
```

A conversational answer should not force the user to manually interpret everything.

For example:

> “San Luis sigue siendo tu mejor opción.”

followed by an actual:

```text
San Luis
11 min
8h 35m total

[ Ver cruce ]
[ Navegar ]
```

---

# 45. Avisos

User-facing term:

> **Avisos**

The bell is globally accessible.

Avisos can include:

```text
Crossing changed
Recommendation changed
Crossing closed
Wait increased
Wait decreased
Trip reminder
Checklist reminder
Data warning
Unusual border condition
```

Not everything needs to become a notification.

Only materially useful events should generate Avisos.

---

# 46. Contextual Avisos

Example:

```text
TU RECOMENDACIÓN CAMBIÓ

San Luis ya no es la mejor opción.

Ahora:
Lukeville
14 min más rápido en total.

[ Ver recomendación ]
```

Another:

```text
ANTES DE CRUZAR

Estás cerca de San Luis.

¿Quieres revisar tu checklist?

[ Revisar ]
```

This is where Agent and Avisos become complementary.

Avisos surface the event.

Agent can explain it.

---

# 47. Favorites

Favorites live under Settings.

They are not a primary navigation destination.

```text
CONFIGURACIÓN
    ↓
FAVORITOS

San Luis
Lukeville
Nogales Mariposa
```

Favorites should also be accessible contextually through Crossing Detail.

---

# 48. My Trips

```text
CONFIGURACIÓN
    ↓
MIS VIAJES
```

Only completed trips appear.

Example:

```text
Puerto Peñasco → Los Angeles
San Luis
Completado
26 Ago 2026
```

Active and draft trips belong to Viaje, not My Trips.

---

# 49. Data Sharing

Current implementation:

```text
COMPARTIR DATOS

Próximamente

Estamos explorando formas de permitirte
compartir datos de forma voluntaria para
mejorar Cruze y ofrecer experiencias con
menos publicidad.

Próximamente.
```

This should be explicitly marked:

> **Próximamente**

No fake controls.

No unfinished toggle.

---

# 50. About

About should contain:

```text
Acerca de Cruze
Términos de servicio
Privacidad
Información legal
Fuentes de datos
Versión
```

The exact legal surface can expand later.

---

# 51. Screen Inventory

## Application Initialization

### L01 — Location Permission
Purpose: Explain why location is required.

### L02 — Location Acquisition
Purpose: Acquire and validate location.

### L03 — Location Recovery
Purpose: Recover from denied, disabled, unavailable or low-confidence location.

---

## Viaje

### T01 — Trip Empty / Nearby Intelligence
The default landing surface after location is established.

**Flow:**
1. User opens app → Location Gate (W1) runs → GPS acquired or manual search
2. Gate opens → renders `/trip` (T01)
3. T01 shows:
   - **LOC-STATUS-01** banner at top: "Ubicación establecida: {placeName}" (non-dismissible)
   - **TR-EMPTY-01** replaced by inline destination search:
     - Search input with country filter (MX→US, US→MX based on GPS)
     - Results dropdown filtered to target country
     - Selected destination shown with confirm
   - **Next button** (disabled until selection) → navigates to `/trip/setup` with destination pre-filled
   - **TR-NEAR-01** section: "CERCA DE TI" + "Cruces relevantes ahora" subtitle
   - **TR-NEAR-02** cards (max 3): name, wait time, status badge (● Abierto/● Cerrado/● Limitado), direction (Norte/Sur), freshness ("Actualizado hace X min")
   - **Ver todos los cruces →** centered at bottom → `/crossings`

**No "Comenzar un viaje" button** - destination search IS the entry point.

### T02 — Trip Setup / Destination
Select destination.

### T03 — Trip Setup / Origin
Confirm or override origin.

### T04 — Trip Setup / Travel Mode
Walking / Private / Commercial.

### T05 — Trip Setup / Private Access
Northbound private vehicles only.

### T06 — Trip Setup / Document Profile
Optional northbound private profile.

### T07 — Trip Recommendation
Primary recommendation + alternatives.

### T08 — Active Trip
Execution surface.

### T09 — Trip Settings
Change trip context.

### T10 — Trip Completion
Finish and optionally save.

---

## Cruces

### C01 — Crossings Directory
Live border directory.

### C02 — Crossing Search / Filter
Search and filtering state.

### C03 — Crossing Detail
Canonical crossing information.

### C04 — Crossing Compare
Decision comparison.

### C05 — Contextual Map
Geographic visualization.

---

## Agent

### A01 — Agent Welcome
Initial Agent state.

### A02 — Agent Conversation
Conversation surface.

### A03 — Agent Structured Result
Contextual cards/actions/results.

---

## Avisos

### N01 — Avisos List
Global notification sheet/page.

### N02 — Aviso Detail
Detailed update.

---

## Settings

### S01 — Settings
Main settings page.

### S02 — Profile
Local profile.

### S03 — Favorites
Saved crossings.

### S04 — My Trips
Completed trips.

### S05 — Data Sharing
Coming Soon.

### S06 — About
Legal and product information.

---

# 52. Screen Specification Standard

Every screen must specify:

```text
SCREEN
Purpose
Entry Points
Exit Points
Required State
Optional State
Data Dependencies
Layout
Component Tree
Interactions
Loading State
Empty State
Error State
Stale State
Responsive Behavior
Accessibility
Design Tokens
Analytics
```

This becomes the canonical format for implementation.

---

# 53. Design System Architecture

The design system should have four layers.

```text
01 FOUNDATIONS
       ↓
02 UI PRIMITIVES
       ↓
03 DOMAIN COMPONENTS
       ↓
04 SCREEN COMPOSITIONS
```

---

# 54. Foundations

## Color

### Brand

```text
Cruze Mint       #00E0A0
```

### Background

```text
Midnight         #071A31
Surface          #0E223F
Surface Elevated #132B4A
Border           #1F3A54
```

### Content

```text
Text Primary     #F5F7FA
Text Secondary   #A7B3CC
```

### Semantic

```text
Success / Open   Cruze Mint
Warning          #FFB020
Danger           #FF4D4F
Information      #38A7FF
```

Semantic usage should take precedence over direct color selection.

---

# 55. Color Rules

Mint should represent:

- primary action
- active selection
- successful operational state
- recommendation
- important positive delta

It should not become decorative noise.

Red should communicate:

- closed
- dangerous
- blocked
- critical change

Amber:

- warning
- stale
- limited

Blue:

- informational
- geographic/navigation context

---

# 56. Typography

Recommended system:

### Sora

Use for:

- hero headings
- display numbers
- major recommendations
- prominent crossing names

### Inter

Use for:

- body text
- navigation
- labels
- metadata
- controls
- secondary information

The combination provides distinction without making the entire interface feel like a display font.

---

# 57. Numeric Typography

Border intelligence depends heavily on numbers.

Important values should use a dedicated numeric hierarchy.

Examples:

```text
11 min
8h 35m
23 min faster
```

Use tabular/consistent numeric alignment where appropriate.

---

# 58. Spacing

Use a consistent 4px base system.

Recommended tokens:

```text
4
8
12
16
20
24
32
40
48
64
```

Screen-level spacing should primarily use:

```text
16
24
32
```

Avoid arbitrary one-off spacing.

---

# 59. Radius

Use restrained geometry.

Recommended:

```text
Small controls / pills   4px   (--radius-sm)
Cards / secondary        8px   (--radius-md)   alias: control 8px / card 8px
Large surfaces          12px   (--radius-lg)   alias: surface 12px
XL                      16px   (--radius-xl)
2XL                     20px   (--radius-2xl)
Pills                  999px   (--radius-pill)
```

Do not wrap the entire application in excessive rounded containers.

The product should retain the more technical/editorial visual character established by the design direction.

---

# 60. Borders

Default border:

```text
1px #1F3A54
```

Do not stack borders unnecessarily.

A card should not require:

- outer border
- inner border
- divider
- status pill border
- nested bordered sections

Use hierarchy through spacing, typography and surface elevation first.

---

# 61. Iconography

Use a single consistent icon family.

Core semantic icons:

```text
Navigation
Location
Search
Filter
Chevron
Clock
Car
Walking
Truck
Star
Bell
Settings
Compass
Message
Map
Share
Info
Bookmark
Check
Warning
```

Icons should reinforce semantics and never replace important textual meaning.

---

# 62. Touch Targets

Interactive targets should be approximately:

> **44–48px minimum**

This includes:

- icons
- navigation
- list rows
- segmented controls
- buttons

---

# 63. UI Primitive Layer

Canonical primitives:

```text
PageHeader
BackButton
BottomNav
Tab
Button
IconButton
TextInput
SearchInput
SegmentedControl
RadioGroup
Checkbox
Toggle
Select
Badge
StatusBadge
Banner
Toast
EmptyState
ErrorState
Skeleton
Spinner
Divider
Stack
Inline
Section
BottomSheet
Modal
Drawer
DataMetric
DataMetricPair
DataDelta
DataTimestamp
DataStatus
```

These should remain generic.

They should not contain Cruze domain logic.

---

# 64. Domain Component Naming

This is critical for reconciling the new architecture with the existing Cruze codebase.

Avoid ambiguous names such as:

```text
Card
Panel
Box
Item
Widget
Section
ListItem
```

Instead use:

> **Domain + Surface + Responsibility**

Examples:

```text
CrossingListRow
CrossingDetailLaneSection
TripRecommendationPrimaryCard
TripAlternativeListRow
AgentCrossingResult
AvisoRecommendationChange
```

The component name should tell an engineer:

1. what domain it belongs to
2. where it is used
3. what it does

---

# 65. App Shell Components

```text
CruzeAppHeader
CruzeBottomNav
CruzeNotificationButton
CruzeSettingsButton
CruzePageHeader
CruzeBackHeader
CruzeLiveIndicator
```

---

# 66. Location Components

```text
LocationPermissionGate
LocationPermissionPrompt
LocationAcquisitionState
LocationRecoveryPanel
LocationConfidenceIndicator
LocationStatusBanner
```

The location gate is infrastructure-level, not a Trip component.

---

# 67. Trip Components

```text
TripEmptyActionPanel
TripNearbyCrossingsSection
TripNearbyCrossingRow

TripSetupProgress
TripSetupDestinationStep
TripSetupOriginStep
TripSetupTravelModeStep
TripSetupVehicleAccessStep
TripSetupDocumentProfileStep

TripRecommendationPrimaryCard
TripRecommendationReasonList
TripAlternativeListSection
TripAlternativeListRow

TripStatusHeader
TripRouteSummary
TripActionBar
TripChecklistSection
TripChecklistRow
TripSettingsSheet
TripCompletionPrompt
```

---

# 68. Crossing Components

```text
CrossingsDirectoryList
CrossingsDirectoryRow
CrossingsDirectoryExpandedRow
CrossingsDirectorySearchInput
CrossingsDirectoryFilterBar

CrossingStatusBadge
CrossingDirectionTimes
CrossingWaitTime
CrossingWaitDelta
CrossingFreshness

CrossingDetailHero
CrossingDetailMap
CrossingDetailLaneSection
CrossingDetailLaneRow
CrossingDetailAccessSection
CrossingDetailHoursSection
CrossingDetailRequirementsSection
CrossingDetailRestrictionsSection
CrossingDetailServicesSection
CrossingDetailActionBar

CrossingFavoriteButton
CrossingsCompareTable
```

---

# 69. Recommendation Components

```text
RecommendationBadge
RecommendationMetric
RecommendationReason
RecommendationDelta
RecommendationRank
RecommendationRow
RecommendationList
RecommendationRefreshButton
```

These should be reusable by Trip and Agent.

---

# 70. Agent Components

```text
AgentHeader
AgentWelcome
AgentPromptList
AgentPromptChip
AgentMessageList
AgentMessage
AgentComposer

AgentCrossingResult
AgentRecommendationResult
AgentTripAction
AgentChecklistResult
```

---

# 71. Avisos Components

```text
AvisosSheet
AvisosBadge
AvisoRow
AvisoCrossingChange
AvisoRecommendationChange
AvisoTripReminder
AvisoChecklistReminder
AvisoDataWarning
AvisosEmptyState
```

---

# 72. Settings Components

```text
SettingsList
SettingsSection
ProfileSettings
FavoriteCrossingsList
SavedTripsList
DataSharingPlaceholder
AboutLinksList
```

---

# 73. Existing Component Reconciliation

The new catalog is **not** an instruction to blindly rename the existing codebase.

Every existing component should be classified:

```text
KEEP
RENAME
MERGE
SPLIT
REMOVE
```

Example:

If the current code has:

```text
CrossingCard
```

inspect what it actually does.

If it is a compact directory row:

```text
CrossingListRow
```

If it is a recommendation:

```text
TripRecommendationPrimaryCard
```

If it contains too many responsibilities:

```text
SPLIT
```

into the appropriate domain components.

The objective is not naming purity.

The objective is a component architecture where responsibility is obvious.

---

# 74. Component Composition Example

Trip recommendation:

```text
TripRecommendationPrimaryCard
│
├── RecommendationBadge
├── CrossingDetailHero
├── CrossingStatusBadge
├── RecommendationMetric
├── RecommendationReasonList
└── TripActionBar
```

Crossing detail:

```text
CrossingDetailHero
CrossingDetailMap
CrossingDirectionTimes
CrossingDetailLaneSection
CrossingDetailAccessSection
CrossingDetailHoursSection
CrossingDetailRequirementsSection
CrossingDetailRestrictionsSection
CrossingDetailServicesSection
CrossingDetailActionBar
```

This keeps domain composition explicit.

---

# 75. Data Model — Conceptual

Cruze currently does not require accounts.

Core local entities:

```text
LocalProfile
FavoriteCrossing
Trip
TripChecklistState
AvisoState
LocationState
```

External/live entities:

```text
Crossing
CrossingDirection
CrossingLane
CrossingAccess
CrossingHours
CrossingRequirement
CrossingRestriction
CrossingService
CrossingObservation
```

---

# 76. Crossing Observation

A crossing's live data should carry at minimum:

```text
crossingId
direction
waitTime
status
observedAt
source
confidence
```

The UI should never infer freshness from the existence of a value.

Freshness comes from:

```text
observedAt
```

---

# 77. Recommendation Input

The recommendation engine should be able to receive:

```text
Location
Destination
Origin
Travel Mode
Direction
Access Type
Document Profile
Crossing Data
Travel Time
Data Freshness
Operational Status
```

The engine returns:

```text
Recommended Crossing
Alternatives
Reasons
Estimated Total Time
Delta vs Alternatives
Confidence
```

---

# 78. Recommendation Trust

Cruze should explain recommendations.

Not:

> San Luis is recommended.

But:

> San Luis is recommended because it has the lowest estimated total travel time among compatible crossings.

The user should be able to understand the decision without needing the Agent.

---

# 79. Error Architecture

Every intelligence surface needs:

### Loading

```text
Skeleton
```

### No data

```text
No current data available
```

### Stale

```text
Data may be outdated
```

### Error

```text
We couldn't update crossing data
```

### Location unavailable

```text
We need your location to determine
which crossings are relevant.
```

---

# 80. Empty States

Empty does not mean dead.

### No Trip

```text
¿A dónde vas?

Comienza un viaje para encontrar
el mejor cruce.

[ Comenzar un viaje ]

o

Ver todos los cruces
```

But below that:

```text
CERCA DE TI
```

should still appear when location is available.

### No Favorites

```text
No tienes cruces guardados.

Guarda un cruce para acceder a él rápidamente.
```

### No Avisos

```text
Todo tranquilo.

Te avisaremos cuando haya un cambio
importante en tus cruces o viajes.
```

---

# 81. Localization Rules

The current screenshots contain several mixed-language concepts.

The production UI should be consistently Spanish.

Avoid:

```text
Fastest overall
Open
Live
```

when the rest of the interface is Spanish.

Prefer:

```text
Más rápido en total
Abierto
En vivo
```

However, “En vivo” must only be used when the freshness state actually qualifies.

Create a small product glossary so terms remain consistent:

```text
Trip             Viaje
Crossing         Cruce
Alert            Aviso
Live             En vivo
Freshness        Actualización / Datos recientes
Recommended      Recomendado
Wait time        Tiempo de espera
Northbound       Norte
Southbound       Sur
```

---

# 82. Visual Hierarchy

The strongest visual hierarchy should generally be:

```text
1. Decision
2. Primary number
3. Status
4. Explanation
5. Supporting information
6. Secondary actions
```

For a crossing:

```text
SAN LUIS
11 min
● Abierto
Actualizado hace 2 min
```

not:

```text
SAN LUIS
lots of metadata
lots of badges
11 min buried in card
```

---

# 83. Current Visual Issues to Correct

The regenerated implementation should explicitly correct:

### 1. Excessive card treatment

Not every section needs a bordered rounded card.

### 2. Inconsistent CTA hierarchy

One clear primary action per context.

### 3. Mixed language

Spanish UI should remain Spanish.

### 4. Stale data labeled as live

Must be fixed at the data/state layer.

### 5. Overly long onboarding

Replace fixed onboarding with adaptive Trip Setup.

### 6. Too many primary navigation destinations

Reduced to:

```text
Viaje
Cruces
Agente
```

### 7. Alerts competing with navigation

Moved to global bell/Avisos.

### 8. Favorites competing with navigation

Moved to Settings/contextual actions.

### 9. Map competing with core product

Map becomes contextual.

### 10. Excessive information in crossing cards

Directory rows remain compact; details progressively disclose.

---

# 84. Trip vs Crossings — Explicit Boundary

This distinction should be enforced throughout design and implementation.

## Viaje

```text
Personalized
Route-aware
Decision-oriented
Recommendation-heavy
Contextual
```

## Cruces

```text
Live
Reference-oriented
Dense
Searchable
Comparable
```

If a component cannot clearly answer which of these two mental models it belongs to, its responsibility should be reconsidered.

---

# 85. Crossing → Trip Convergence

There should be a clean bridge between the two systems.

```text
Crossings
   ↓
Crossing Detail
   ↓
Usar este cruce
   ↓
Trip Setup
```

And:

```text
Trip
   ↓
Recommendation
   ↓
Crossing Detail
```

The crossing entity remains the shared domain object.

---

# 86. Agent → Everything Convergence

Agent can route users to any surface.

```text
Agent
 ├── Crossing
 ├── Recommendation
 ├── Trip
 ├── Checklist
 ├── Aviso
 └── Settings
```

The Agent should not duplicate those experiences.

It should **deep-link into them**.

---

# 87. Aviso → Agent Convergence

Example:

```text
Aviso
"Tu recomendación cambió."

        ↓

[ ¿Por qué? ]

        ↓

Agent

"San Luis dejó de ser la mejor opción
porque su tiempo de espera aumentó..."
```

This is a strong reason to make Agent contextual.

---

# 88. Location → Everything Convergence

Location becomes a shared context provider.

```text
Location
   │
   ├── Nearby Crossings
   ├── Trip Origin
   ├── Crossing Ranking
   ├── Map
   ├── Agent Context
   └── Avisos
```

This prevents each screen from inventing its own location logic.

---

# 89. Recommended Application State

Conceptually:

```text
CruzeContext
│
├── location
├── profile
├── trip
├── crossings
├── recommendations
├── avisos
└── agentContext
```

Screens consume context.

They should not independently reconstruct it.

---

# 90. Location Failure Principle

If location fails:

Cruze should **not pretend it knows the user's nearby border context**.

Instead:

```text
Necesitamos tu ubicación

Para mostrarte los cruces relevantes
necesitamos saber dónde estás.

[ Intentar de nuevo ]

[ Abrir configuración ]
```

The user can still access non-personalized product information where appropriate, but personalized intelligence remains gated.

---

# 91. First-Launch Experience

Canonical first launch:

```text
Launch
 ↓
Location Permission
 ↓
Location Acquisition
 ↓
Location Ready
 ↓
Viaje
 ↓
"¿A dónde vas?"
 ↓
Nearby Crossings
```

No separate splash onboarding carousel.

No unnecessary account creation.

No profile questionnaire before the product demonstrates value.

---

# 92. Returning User Without Active Trip

```text
Launch
 ↓
Location Refresh
 ↓
Viaje
 ↓
Nearby Crossings
```

If a previous completed trip exists, optionally show:

```text
TU ÚLTIMO VIAJE

Puerto Peñasco → Los Angeles
```

but it must not dominate the live border information.

---

# 93. Returning User With Active Trip

```text
Launch
 ↓
Location Refresh
 ↓
Viaje
 ↓
Active Trip
```

The active trip becomes the primary content.

Nearby crossings remain secondary/contextual.

---

# 94. Location Refresh

Location should not necessarily require a permission prompt every launch.

Instead:

```text
Permission
    ↓
Current location
    ↓
Refresh according to lifecycle
```

The permission request is a one-time system interaction.

The location itself can be refreshed as needed.

---

# 95. Data Freshness UX

Every live border value should have an associated freshness state.

Good:

```text
11 min
Actualizado hace 2 min
```

Warning:

```text
11 min
Actualizado hace 34 min
Datos desactualizados
```

Unavailable:

```text
—
Sin datos actuales
```

Never silently show stale numbers as current.

---

# 96. Accessibility

Requirements:

- minimum touch target approximately 44–48px
- semantic labels for icons
- status cannot rely solely on color
- sufficient contrast
- dynamic text support
- screen-reader-friendly navigation
- clear focus states
- reduced-motion support
- meaningful announcements for changing wait times
- accessible alternatives to map-only information

Example:

Do not communicate:

> green dot = open

only through color.

Use:

> ● Abierto

---

# 97. Analytics

Analytics should follow product decisions, not vanity metrics.

Important events:

```text
location_permission_granted
location_permission_denied
location_ready
location_recovery
nearby_crossing_viewed
nearby_crossing_selected

trip_started
trip_destination_selected
trip_origin_selected
trip_mode_selected
trip_access_selected
trip_document_profile_completed
trip_recommendation_viewed
trip_alternative_selected
trip_navigation_started
trip_completed

crossings_opened
crossing_search
crossing_filter
crossing_detail_viewed
crossing_favorited
crossing_compare_started
crossing_selected_for_trip

agent_opened
agent_prompt_used
agent_question_submitted
agent_action_selected

aviso_opened
aviso_action_selected
```

Do not track sensitive document contents.

---

# 98. Implementation Priority

## Phase 1 — Foundation

```text
App Shell
Location Gate
Location State
Crossing Data Model
Freshness Model
Crossing Directory
Crossing Detail
```

## Phase 2 — Core Value

```text
Nearby Crossing Preview
Trip Setup
Adaptive Questionnaire
Recommendation Engine
Active Trip
```

## Phase 3 — Intelligence

```text
Agent
Avisos
Contextual Checklist
Compare
```

## Phase 4 — Supporting Product

```text
Profile
Favorites
My Trips
Data Sharing
About
```

---

# 99. Migration Strategy

Do not rebuild the entire application simultaneously.

Recommended migration:

### Step 1

Establish semantic foundations:

```text
OperationalStatus
DataFreshness
TravelMode
Direction
AccessType
TripState
LocationState
```

### Step 2

Refactor crossing components.

### Step 3

Build canonical Crossing Detail.

### Step 4

Build Location Gate.

### Step 5

Replace old onboarding with Trip Setup.

### Step 6

Build Nearby Crossing Preview.

### Step 7

Implement new three-tab navigation.

### Step 8

Integrate Agent context.

### Step 9

Move Favorites and Avisos out of primary navigation.

### Step 10

Remove obsolete screens/components.

---

# 100. Canonical Navigation Model

The final product model is:

```text
                         CRUZE
                           │
                    LOCATION READY
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
           VIAJE        CRUCES         AGENTE
             │             │             │
             │             │             │
       Personalized      Live          Conversational
        decision       reference        intelligence
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                    SHARED CRUZE
                   INTELLIGENCE LAYER
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
          Crossings       Trips       Context
              │            │            │
              └────────────┼────────────┘
                           ↓
                         AVISOS
                           │
                           ↓
                       SETTINGS
```

---

# 101. Final Product Mental Model

The user should be able to understand Cruze in approximately five seconds:

### Viaje

> **Tell Cruze where you're going.**

### Cruces

> **See what the border looks like right now.**

### Agente

> **Ask Cruze anything.**

Everything else supports those three ideas.

---

# 102. Final Design Principle

Cruze should progressively reveal intelligence.

The sequence is:

```text
WHERE AM I?
     ↓
WHAT'S NEAR ME?
     ↓
WHAT'S HAPPENING?
     ↓
WHERE AM I GOING?
     ↓
HOW AM I CROSSING?
     ↓
WHAT SHOULD I USE?
     ↓
WHAT SHOULD I DO BEFORE CROSSING?
     ↓
DID SOMETHING CHANGE?
```

The interface should never ask a question merely because the system *could* ask it.

It should ask only when the answer materially improves the user's decision.

That is the central UX rule for Cruze.

---

# 103. Canonical Component Taxonomy

For implementation, the final hierarchy should be:

```text
FOUNDATIONS
│
├── Colors
├── Typography
├── Spacing
├── Radius
├── Borders
├── Elevation
├── Motion
└── Iconography

PRIMITIVES
│
├── Button
├── Input
├── Tabs
├── Badge
├── Status
├── Data Metric
├── Sheet
├── Modal
├── List
└── Layout

LOCATION DOMAIN
│
├── LocationPermissionGate
├── LocationAcquisitionState
├── LocationRecoveryPanel
└── LocationConfidenceIndicator

TRIP DOMAIN
│
├── TripSetup*
├── TripRecommendation*
├── TripActive*
├── TripChecklist*
└── TripCompletion*

CROSSING DOMAIN
│
├── CrossingsDirectory*
├── CrossingDetail*
├── CrossingCompare*
└── CrossingMap*

AGENT DOMAIN
│
├── AgentConversation*
├── AgentResult*
└── AgentAction*

AVISO DOMAIN
│
├── Avisos*
└── Aviso*

SETTINGS DOMAIN
│
├── Profile*
├── Favorites*
├── MyTrips*
├── DataSharing*
└── About*

SCREEN COMPOSITIONS
│
├── Viaje
├── Cruces
├── Agente
├── Avisos
└── Settings
```

This becomes the structural baseline for the Cruze implementation.

---

# 104. Final Decision Set

The following decisions should now be considered **frozen unless implementation evidence proves otherwise**:

| Decision | Final |
|---|---|
| Primary navigation | **Viaje / Cruces / Agente** |
| Location | **Required initialization prerequisite** |
| Nearby crossings | **2–3 highly relevant crossings on Viaje** |
| Full directory | **Cruces tab** |
| Favorites | **Settings + contextual** |
| Alerts | **Global bell → Avisos** |
| Settings | **Global gear** |
| Map | **Contextual, not primary navigation** |
| Onboarding | **Replaced conceptually by Trip Setup** |
| Walking questionnaire | **Minimal** |
| Commercial questionnaire | **Minimal** |
| Private vehicle questionnaire | **Adaptive** |
| Northbound private vehicle | **Access/document context when useful** |
| Southbound private vehicle | **Avoid unnecessary questions** |
| Accounts | **Not required** |
| Profile | **Local** |
| Saved trips | **Completed trips only** |
| Agent | **Contextual intelligence layer, not isolated chatbot** |
| Operational state | **Separate from freshness** |
| Live label | **Only when freshness qualifies** |
| Component naming | **Domain + surface + responsibility** |
| Design hierarchy | **Decision → metric → status → explanation → secondary info** |

---

# 105. The Product in One Flow

The entire application can now be understood through one canonical scenario:

```text
USER OPENS CRUZE
       ↓
LOCATION ESTABLISHED
       ↓
┌──────────────────────────────┐
│ VIAJE                        │
│                              │
│ ¿A dónde vas?                │
│ [ Comenzar un viaje ]        │
│                              │
│ CERCA DE TI                  │
│                              │
│ San Luis          11 min     │
│ Lukeville         18 min     │
│ Nogales           24 min     │
│                              │
│ Ver todos los cruces →      │
└──────────────────────────────┘
       │                 │
       │                 └──────────────→ CRUCES
       │                                      ↓
       │                               DIRECTORY
       │                                      ↓
       │                               DETAIL / MAP
       │                                      ↓
       │                               USAR ESTE CRUCE
       │                                      ↓
       └──────────────→ TRIP SETUP ←──────────┘
                              ↓
                       TRAVEL MODE
                              ↓
                    ADAPTIVE QUESTIONS
                              ↓
                       RECOMMENDATION
                              ↓
                        ACTIVE TRIP
                              ↓
                     PRE-CROSSING CHECKLIST
                              ↓
                           CROSS
                              ↓
                         COMPLETED
                              ↓
                       SAVE TO MY TRIPS
```

And at any point:

```text
                         AGENTE
                            ↑
                            │
Viaje ────────────────→ Context
Cruces ───────────────→ Context
Crossing ─────────────→ Context
Aviso ────────────────→ Context
Trip ─────────────────→ Context
                            │
                            ↓
                     Action / Answer
```

That is the architecture I would now use as the **source of truth for the Cruze product and UI implementation**.