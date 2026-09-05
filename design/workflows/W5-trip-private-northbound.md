# CRUZE — W5 Workflow Specification

## Trip Setup — Private Vehicle Northbound (MX → US)

**Workflow ID:** W5
**Surface:** Viaje
**Direction:** `MX_TO_US`
**Travel mode:** `privateVehicle`
**Outcome:** Context-aware crossing recommendation → Active Trip

---

## 1. Workflow Intent

W5 covers the adaptive flow for a traveler crossing **from Mexico to the United States in a private vehicle**.

The workflow intentionally collects information progressively:

1. Destination
2. Origin
3. Travel mode
4. **Direction derived automatically**
5. Vehicle access
6. Document profile
7. Crossing recommendation
8. Active trip

The supplied specification explicitly defines the sequence as T01 → T03 → T04 → direction → access → document → T07.

The core principle is:

> **Given where I am, where I'm going, and how I'm crossing — what should I do?**

The workflow should therefore never ask for information that does not materially affect the recommendation.

---

## 2. Workflow Diagram

```text
                         ┌───────────────────┐
                         │      LAUNCH       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  LOCATION GATE    │
                         │                   │
                         │ Location ready    │
                         └─────────┬─────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ T01 — VIAJE                                                         │
│                                                                     │
│  TU VIAJE                                                           │
│  ¿A dónde vas?                                                     │
│                                                                     │
│  [ Buscar destino en EE.UU... ]                                    │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│  CERCA DE TI                                                        │
│  Cruces relevantes ahora                                           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ San Ysidro                               11 min             │   │
│  │ ● Abierto · Norte · Actualizado hace 2 min              → │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Otay Mesa                               25 min              │   │
│  │ ● Limitado · Norte · Actualizado hace 3 min              → │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                       Ver todos los cruces →                        │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                         destination selected
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ T03 — ORIGIN                                                       │
│                                                                     │
│                    ¿Desde dónde sales?                             │
│                                                                     │
│              [ Usar mi ubicación actual ]                          │
│                                                                     │
│                    o                                                │
│                                                                     │
│              [ Buscar origen en México... ]                        │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ T04 — TRAVEL MODE                                                  │
│                                                                     │
│                    ¿Cómo vas a cruzar?                             │
│                                                                     │
│              ○ A pie                                                │
│              ● Vehículo personal                                   │
│              ○ Comercial                                            │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
                    ┌───────────────────────────┐
                    │     DIRECTION ENGINE      │
                    │                           │
                    │ Origin: MX                │
                    │ Destination: US           │
                    │                           │
                    │        MX → US             │
                    │        NORTE               │
                    │                           │
                    │    AUTO-DERIVED            │
                    └────────────┬──────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ ACC — VEHICLE ACCESS                                               │
│                                                                     │
│              ¿Qué tipo de acceso tienes?                           │
│                                                                     │
│              ○ Estándar                                            │
│              ○ Ready Lane                                           │
│              ○ SENTRI                                               │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ DOC — DOCUMENT PROFILE                                             │
│                                                                     │
│              ¿Qué documento utilizas?                              │
│                                                                     │
│              ○ Pasaporte / documento de viaje                       │
│              ○ Visa                                                  │
│              ○ Ciudadano / residente de EE.UU.                     │
│              ○ No estoy seguro                                      │
│                                                                     │
│                         Omitir                                      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ T07 — RECOMMENDATION                                               │
│                                                                     │
│                         RECOMENDADO                                 │
│                                                                     │
│                    San Ysidro — Ready Lane                         │
│                                                                     │
│                       12 min                                        │
│                    tiempo de espera                                │
│                                                                     │
│  ● Abierto                                                         │
│  Actualizado hace 2 min                                            │
│                                                                     │
│  ¿POR QUÉ ESTE CRUCE?                                              │
│  ✓ Compatible con tu acceso                                       │
│  ✓ Compatible con tu perfil                                       │
│  ✓ Datos recientes                                                 │
│                                                                     │
│  TU CONTEXTO                                                        │
│  Acceso: Ready Lane                                                │
│  Documento: Pasaporte                                              │
│                                                                     │
│  ALTERNATIVAS                                                       │
│  San Ysidro SENTRI          8 min                                  │
│  Otay Mesa Ready           18 min                                  │
│  Tecate Estándar           35 min                                  │
│                                                                     │
│                     [ INICIAR VIAJE ]                              │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
                         ┌───────────────────┐
                         │   ACTIVE TRIP     │
                         │                   │
                         │     ACTIVE        │
                         └───────────────────┘
```

---

## 3. Screen / Surface Sequence

| Step | ID     | Surface        | Responsibility                           |
| ---- | ------ | -------------- | ---------------------------------------- |
| 1    | T01    | Viaje          | Destination search + nearby intelligence |
| 2    | T03    | Trip Setup     | Establish origin                         |
| 3    | T04    | Trip Setup     | Select travel mode                       |
| 4    | —      | Domain logic   | Derive `MX_TO_US`                        |
| 5    | ACC    | Trip Setup     | Select vehicle access                    |
| 6    | DOC    | Trip Setup     | Select document profile                  |
| 7    | T07    | Recommendation | Explain best crossing                    |
| 8    | Active | Viaje          | Manage active trip                       |

The key architectural correction is **step 4**: direction does not need to consume a full screen when the route is unambiguous.

---

## 4. T01 — Viaje / Destination Search

```text
┌──────────────────────────────────────────────┐
│ CRUZE                              🔔    ⚙   │
├──────────────────────────────────────────────┤
│                                              │
│ ✓ Ubicación establecida                      │
│   Tijuana, BC                                │
│                                              │
│ TU VIAJE                                     │
│                                              │
│ ¿A dónde vas?                                │
│                                              │
│ Busca tu destino para recibir                │
│ inteligencia personalizada para tu cruce.    │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🔍  Buscar destino en EE.UU...          │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │              Siguiente →                 │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ CERCA DE TI                         Ver todos │
│ Cruces relevantes ahora                     │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗  San Ysidro                 11 min    │ │
│ │     ● Abierto · Norte · Actualizado 2m │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗  Otay Mesa                 25 min     │ │
│ │     ● Limitado · Norte · Actualizado 3m│ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗  Tecate                     8 min     │ │
│ │     ● Abierto · Norte · Actualizado 1m │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│             Ver todos los cruces →           │
├──────────────────────────────────────────────┤
│       Viaje         Cruces         Agente    │
└──────────────────────────────────────────────┘
```

### Components

```text
APP-HEAD-01   CruzeAppHeader
APP-AV-01     CruzeNotificationButton
APP-SET-01    CruzeSettingsButton
LOC-STATUS-01 LocationStatusBanner
TR-EMPTY-01   TripDestinationSearch
TR-NEAR-01    TripNearbyCrossingsSection
TR-NEAR-02    TripNearbyCrossingRow
APP-NAV-01    CruzeBottomNav
```

---

## 5. T03 — Origin

```text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 2 de 5                                       │
│ ━━━━━━━━━━━━━━━━━                            │
│                                              │
│ ¿Desde dónde sales?                          │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ◎  Usar mi ubicación actual          ✓  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Tijuana, BC                                  │
│ México                                       │
│                                              │
│ O busca otro lugar                           │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🔍  Buscar origen en México...          │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

```text
TR-SETUP-03 TripSetupOriginStep
```

---

## 6. T04 — Travel Mode

```text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 3 de 5                                       │
│ ━━━━━━━━━━━━━━━━━━━━━                        │
│                                              │
│ ¿Cómo vas a cruzar?                          │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 👟  A pie                                │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗  Vehículo personal               ●  │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚛  Comercial                            │ │
│ └──────────────────────────────────────────┘ │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

```text
TR-SETUP-04 TripSetupTravelModeStep
```

---

## 7. Direction — Derived Domain State

```text
ORIGIN                         DESTINATION
Tijuana, BC                    San Diego, CA
   🇲🇽                              🇺🇸
       └─────────── MX → US ───────────┘
                         │
                         ▼
                       NORTE
```

```text
direction = MX_TO_US
```

The UI may expose the derived direction as context, but W5 should not add an unnecessary standalone selection screen.

---

## 8. ACC — Vehicle Access

```text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│ 4 de 5                                       │
│ TIPO DE ACCESO                               │
│ ¿Qué tipo de acceso tienes?                  │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗  Estándar                         ○  │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ ⚡  Ready Lane                       ○  │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ ◉   SENTRI                           ○  │ │
│ └──────────────────────────────────────────┘ │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

```text
TR-SETUP-05 TripSetupVehicleAccessStep
```

Values: `STANDARD / READY_LANE / SENTRI`

---

## 9. DOC — Document Profile

```text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│ 5 de 5                                       │
│ DOCUMENTO DE VIAJE                           │
│ ¿Qué documento utilizas para viajar?         │
│ ○  Pasaporte / documento de viaje             │
│ ○  Visa                                       │
│ ○  Ciudadano / residente de EE.UU.            │
│ ○  No estoy seguro                            │
│                    Omitir                    │
│              Ver recomendación →             │
└──────────────────────────────────────────────┘
```

### Component

```text
TR-SETUP-06 TripSetupDocumentProfileStep
```

Never collect passport/document numbers. Profile is recommendation context, not legal verification.

---

## 10. T07 — Recommendation

```text
┌──────────────────────────────────────────────┐
│ ←  Tu recomendación                          │
│ [ Norte ] [ Vehículo personal ]              │
│ RECOMENDADO                                  │
│ San Ysidro  Ready Lane  12 min  40 min total │
│ ● Abierto  Actualizado hace 2 min            │
│ ¿POR QUÉ ESTE CRUCE? ✓ Compatible acceso... │
│ TU CONTEXTO Acceso Ready Lane Doc Pasaporte  │
│ ALTERNATIVAS San Ysidro SENTRI 8 min etc     │
│              [ INICIAR VIAJE ]               │
└──────────────────────────────────────────────┘
```

### Components

```text
TR-REC-01   TripRecommendationPrimaryCard
TR-REC-02   TripRecommendationReasonList
TR-REC-03   TripAlternativeListSection
TR-REC-04   TripAlternativeListRow
CR-STATUS-01/03/04/05
```

---

## 11. Recommendation Hierarchy

```text
01 APP CONTEXT → 02 SCREEN INTENT → 03 PRIMARY DECISION → 04 PRIMARY METRIC → 05 OPERATIONAL STATE → 06 FRESHNESS → 07 EXPLANATION → 08 SECONDARY OPTIONS → 09 PRIMARY ACTION
```

Mint is semantic, not decorative.

---

## 12. Operational State ≠ Freshness

Valid: `● Abierto / Actualizado hace 2 h`
Invalid: `● Abierto / EN VIVO · Actualizado hace 2 h`
States: OPEN/LIMITED/CLOSED/UNKNOWN × LIVE/RECENT/STALE/UNAVAILABLE

---

## 13. Component Dependency Map

```text
T01 VIAJE → APP-HEAD-01, LOC-STATUS-01, TR-EMPTY-01, TR-NEAR-01/TR-NEAR-02 (CR-STATUS-*)
T03 ORIGIN → TR-SETUP-01, TR-SETUP-03
T04 TRAVEL MODE → TR-SETUP-01, TR-SETUP-04
DIRECTION → direction-detection MX_TO_US
ACC → TR-SETUP-01, TR-SETUP-05
DOC → TR-SETUP-01, TR-SETUP-06
T07 RECOMMENDATION → TR-REC-01..04 + Trip action
```

---

## 14. Data Contract

```ts
{
  origin, destination,
  travelMode: "privateVehicle",
  direction: "MX_TO_US",
  accessType: "standard" | "readyLane" | "sentri",
  documentProfile: "passport" | "visa" | "usCitizenResident" | "notSure" | "omitted",
  recommendation: { crossingId, laneContext, reasons, waitTime, estimatedTotalTime, operationalState, freshness }
}
```

---

## 15. Error / Recovery Paths

No compatible crossing → [ Usar carriles estándar / Cambiar acceso / Ver todos ]
Document/access mismatch → [ Cambiar documento / Cambiar acceso ]
Stale intelligence → [ Ver cruces ]
Location lost → [ Reintentar ubicación ]
Same-country route → No cruce fronterizo necesario

---

## 16. Active Trip Transition

DRAFT → PLANNING → READY → ACTIVE → AT BORDER → COMPLETED → Only COMPLETED → Mis viajes

---

## 17. Pre-Crossing Checklist — TR-ACT-04

ANTES DE CRUZAR — ✓ Cruce abierto, datos recientes, ruta, documentos, acceso, restricciones — generated from actual data

---

## 18. W5 Component Reference — Canonical

| ID | Component |
|----|-----------|
| APP-HEAD-01 | CruzeAppHeader |
| APP-AV-01 | CruzeNotificationButton |
| APP-SET-01 | CruzeSettingsButton |
| APP-NAV-01 | CruzeBottomNav |
| LOC-STATUS-01 | LocationStatusBanner |
| LOC-CONF-01 | LocationConfidenceIndicator |
| LOC-REC-01 | LocationRecoveryPanel |
| TR-EMPTY-01 | TripDestinationSearch |
| TR-NEAR-01 | TripNearbyCrossingsSection |
| TR-NEAR-02 | TripNearbyCrossingRow |
| TR-SETUP-01 | TripSetupProgress |
| TR-SETUP-02 | TripSetupDestinationStep |
| TR-SETUP-03 | TripSetupOriginStep |
| TR-SETUP-04 | TripSetupTravelModeStep |
| TR-SETUP-05 | TripSetupVehicleAccessStep |
| TR-SETUP-06 | TripSetupDocumentProfileStep |
| TR-REC-01 | TripRecommendationPrimaryCard |
| TR-REC-02 | TripRecommendationReasonList |
| TR-REC-03 | TripAlternativeListSection |
| TR-REC-04 | TripAlternativeListRow |
| TR-ACT-01 | TripStatusHeader |
| TR-ACT-02 | TripRouteSummary |
| TR-ACT-03 | TripActionBar |
| TR-ACT-04 | TripChecklistSection |
| TR-COMP-01 | TripCompletionPrompt |
| CR-STATUS-01 | CrossingStatusBadge |
| CR-STATUS-02 | CrossingDirectionTimes |
| CR-STATUS-03 | CrossingWaitTime |
| CR-STATUS-04 | CrossingWaitDelta |
| CR-STATUS-05 | CrossingFreshness |
| CR-DET-01 | CrossingDetailHero |
| CR-DET-03 | CrossingDetailLaneSection |
| CR-DET-04 | CrossingDetailAccessSection |

---

## 19. Final Canonical Flow

```text
LOCATION READY → T01 VIAJE (Destination + Nearby) → T03 ORIGIN → T04 MODE Private → DIRECTION MX→US AUTO → ACCESS → DOCUMENT → T07 RECOMMENDATION → START TRIP → ACTIVE TRIP
```

*Source of truth for W5: this document + `design/workflows/W5_component_level_design_spec.md` (tokens) + `design/components/<ID>-<Name>.md` (per-component specs). See `design/components/README.md` index.*

