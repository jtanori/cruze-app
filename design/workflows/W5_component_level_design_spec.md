# CRUZE --- W5 Component-Level Design Specification
**Version:** 1.2 — 2026-09-07 — W5 canon 1.1 (radii 4/8/12/16/20, nav 56/68+safe); header 56px 3-zone + measured centering; TR-EMPTY-01 compound input (icon CTA, no eyebrow/button/helper); bottom nav 68px. If version differs, revisit testing per `design/TESTING_INTEGRATION_PLAN.md:11` + `docs/TESTING_TOOLS.md`.

## Trip Setup --- Private Vehicle Northbound (MX → US)

**Workflow:** W5\
**Primary surface:** Viaje\
**Direction:** MX → US\
**Travel mode:** Vehículo personal\
**Document purpose:** Component-level visual and implementation
reference

> This document isolates the components used by W5 and defines their
> ASCII anatomy, responsibility, states, composition, and design-token
> usage.

------------------------------------------------------------------------

# 1. Design Foundation

## 1.1 Canonical color tokens

  --------------------------------------------------------------------------
  Token                      Value                   Usage
  -------------------------- ----------------------- -----------------------
  `color.bg.midnight`        `#071A31`               Primary application
                                                     background

  `color.surface`            `#0E223F`               Standard elevated
                                                     surface

  `color.surface.elevated`   `#132B4A`               Higher-elevation
                                                     interactive surface

  `color.border`             `#1F3A54`               Default 1px border

  `color.text.primary`       `#F5F7FA`               Primary text

  `color.text.secondary`     `#A7B3CC`               Secondary text /
                                                     metadata

  `color.brand.mint`         `#00E0A0`               Primary action, active
                                                     state, open,
                                                     recommendation

  `color.semantic.warning`   `#FFB020`               Warning, stale, limited

  `color.semantic.danger`    `#FF4D4F`               Closed, blocked,
                                                     critical

  `color.semantic.info`      `#38A7FF`               Informational /
                                                     geographic / navigation
  --------------------------------------------------------------------------

The source defines these as the canonical foundations and requires
semantic usage to take precedence over arbitrary direct color selection.

## 1.2 Typography

``` text
Display / Hero / Recommendation / Crossing name
→ Sora

Body / Navigation / Labels / Metadata / Controls
→ Inter
```

Numeric intelligence uses a strong, consistent hierarchy with tabular
alignment where appropriate.

## 1.3 Spacing

Base unit: `4px`

``` text
4   8   12   16   20
24  32  40   48   64
```

Screen-level spacing should primarily use:

``` text
16 / 24 / 32
```

## 1.4 Radius

``` text
Controls / small pills   4px   (--radius-sm)
Cards / secondary        8px   (--radius-md)   alias: control 8px / card 8px
Large surfaces          12px   (--radius-lg)   alias: surface 12px
XL                      16px   (--radius-xl)
2XL                     20px   (--radius-2xl)
Pills                  999px   (--radius-pill / --radius-full)
```

Avoid excessive rounded containers.

## 1.5 Borders

``` text
1px solid #1F3A54
```

Hierarchy should be created primarily through spacing, typography and
surface elevation rather than stacked borders.

## 1.6 Touch targets

Interactive controls should target approximately:

``` text
44–48px minimum
```

------------------------------------------------------------------------

# 2. Body Background

The design source establishes `Midnight #071A31` as the canonical
background, but it does **not** specify a formal gradient token.

The attached visual reference shows a very subtle deep-blue atmospheric
gradient rather than a flat fill. Therefore the gradient below should be
treated as a **visual implementation token derived from the current
visual language**, not as a canonical foundation until explicitly
promoted into the design system.

## Recommended implementation

``` text
background:
  base = #071A31

  subtle radial / linear atmospheric layer:
    #0A203B → #071A31
```

### Visual intent

``` text
TOP / HEADER
      │
      │  slightly lighter deep blue
      │
      ▼
BODY
      │
      │  gradual transition
      │
      ▼
LOWER BODY
      │
      │  #071A31
      ▼
BOTTOM NAV
```

The gradient must remain extremely subtle.

It must never compete with:

-   recommendation numbers
-   CTA
-   status colors
-   navigation
-   crossing data

### Suggested CSS expression

``` css
background:
  radial-gradient(
    120% 70% at 50% 0%,
    #0A203B 0%,
    #071A31 68%,
    #06172B 100%
  );
```

This is an implementation approximation of the visual reference, not a
source-defined token.

------------------------------------------------------------------------

# 3. Application Shell

## 3.1 `APP-HEAD-01` --- CruzeAppHeader

### Purpose

Global header for primary application surfaces.

### ASCII

``` text
┌──────────────────────────────────────────────┐
│                                              │
│  CRUZE                         ◉     ⚙      │
│                                              │
└──────────────────────────────────────────────┘
```

### Anatomy

``` text
CruzeAppHeader
├── Brand
│   └── CRUZE
├── CruzeNotificationButton
│   └── unread badge when required
└── CruzeSettingsButton
```

### Tokens

``` text
Height:       56px (compact-height alias; measured 3-zone row)
Padding X:    20px
Background:   transparent / background layer
Brand:        text-sm, 700, uppercase tracking-wider (+ MX/USA badge when resolved)
Title:        center zone, text-xs/sm uppercase, viewport-centered via
              equal side widths (30/30 default, ResizeObserver max)
Icon size:    w-5 (20px)
Icon color:   Text Primary
Gap:          20–24px
Border:       1px #1F3A54
```

### Rules

-   No drawer.
-   No account avatar.
-   No logout.
-   No primary navigation inside the header.
-   Bell opens **Avisos**.
-   Gear opens **Configuración**.

------------------------------------------------------------------------

# 4. `APP-AV-01` --- CruzeNotificationButton

### ASCII

``` text
     ╭──────╮
     │  ♧   │
     │    • │
     ╰──────╯
```

### Responsibility

Entry point to Avisos.

### States

``` text
Default
Unread
Pressed
Disabled
```

### Tokens

``` text
Touch target: 48px
Icon:          24px
Color:         Text Primary
Unread badge:  Cruze Mint
Badge size:    7–8px
```

### Rule

`Avisos` is not a bottom-navigation destination.

------------------------------------------------------------------------

# 5. `APP-SET-01` --- CruzeSettingsButton

### ASCII

``` text
     ╭──────╮
     │  ⚙   │
     ╰──────╯
```

### Responsibility

Opens Settings.

### Tokens

``` text
Touch target: 48px
Icon:          24px
Color:         Text Primary
```

------------------------------------------------------------------------

# 6. `APP-NAV-01` --- CruzeBottomNav

### ASCII

``` text
┌──────────────────────────────────────────────┐
│                                              │
│        ◉              ◯              ◯       │
│      Viaje          Cruces         Agente     │
│       ━━━                                     │
└──────────────────────────────────────────────┘
```

### Destinations

``` text
Viaje
Cruces
Agente
```

### Active state

``` text
Icon:      Cruze Mint
Label:     Cruze Mint
Indicator: Cruze Mint
```

### Inactive state

``` text
Icon:      Text Secondary
Label:     Text Secondary
```

### Tokens

``` text
Height:          68px + safe area (tightened per W7 polish; was 80–96px)
Background:      Surface / translucent Midnight
Top border:      1px #1F3A54
Item width:      33.333%
Touch target:    ≥48px
Label:           Inter 12px (text-xs)
Icon:            w-5 (20px)
Active accent:   #00E0A0
```

### Rules

Exactly three primary destinations.

Do not add:

``` text
Mapa
Favoritos
Avisos
Configuración
```

to this navigation.

------------------------------------------------------------------------

# 7. `LOC-STATUS-01` --- LocationStatusBanner

### ASCII

``` text
┌──────────────────────────────────────────────┐
│  ◎  Ubicación establecida:                  │
│     Puerto Peñasco, SON                 ✓   │
└──────────────────────────────────────────────┘
```

### Responsibility

Communicate established location and its confidence/state without
becoming the primary content.

### Tokens

``` text
Surface:       rgba / Surface
Border:        1px #1F3A54
Radius:         8px
Padding:        12px 16px
Icon:           Cruze Mint
Primary text:   Text Primary
Location text:  Cruze Mint
Height:         ~64px
```

### States

``` text
Established
Low confidence
Refreshing
Unavailable
```

------------------------------------------------------------------------

# 8. `TR-EMPTY-01` --- TripDestinationSearch / Destination Entry

Hero lives in `TR-HERO-01` (no eyebrow on T01); this component is the
compound search control only.

### ASCII

``` text
┌──────────────────────────────────────────────┐
│  ⌕  Busca un destino en EE.UU...        (→)  │
└──────────────────────────────────────────────┘
```

### Tokens

``` text
Hero (TR-HERO-01):
  Title: Sora 30px (text-3xl) / 700, Text Primary
  Body:  Inter 16px (text-base) / 400, Text Secondary, balanced
  No eyebrow on T01

Search:
  Surface Elevated
  Border #1F3A54
  Radius  8px
  Height 56px

CTA (icon-only ArrowRight, floating inside input right):
  w-10 h-10 rounded-full
  Cruze Mint + Midnight icon when selected
  dimmed/disabled until selection
  No text label, no helper line

Placeholder:
  short country names ("EE.UU." / "México"); generic when UNKNOWN
```

### States

``` text
Empty
Focused
Typing
Results
Selected
Disabled
Loading
```

### Important rule

Country comes from resolved location (`userCountry` prop); UNKNOWN never
forces a side (unfiltered + generic copy). The CTA is disabled until a
destination is selected.

------------------------------------------------------------------------

# 9. `TR-SETUP-01` --- TripSetupProgress

### ASCII

``` text
PASO 1 DE 5

━━━━━━━━━━━━━━━━━━━━
```

or compact:

``` text
1 / 5
━━━━━━━━━━━━━━━━━━━━
```

### Tokens

``` text
Track:       Border
Progress:    Cruze Mint
Height:      3–4px
Spacing:     8–12px
Label:       Inter 12–14px / 600
```

### Rule

The flow is dynamic. `TripSetupFlow` determines the actual number of
required steps.

------------------------------------------------------------------------

# 10. `TR-SETUP-02` --- TripSetupDestinationStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 1 DE 5                                       │
│ ━━━━━━━━━                                    │
│                                              │
│ ¿A dónde vas?                                │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ⌕  Buscar en EE.UU...                    │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ San Diego, CA                         🇺🇸    │
│ Los Angeles, CA                       🇺🇸    │
│ Phoenix, AZ                           🇺🇸    │
│                                              │
│                 Siguiente →                  │
└──────────────────────────────────────────────┘
```

### Tokens

``` text
Page background: body gradient
Header:          app shell
Search:          Surface Elevated
Search border:   #1F3A54
Result text:     Text Primary
Secondary data:  Text Secondary
Selected:        Cruze Mint
```

------------------------------------------------------------------------

# 11. `TR-SETUP-03` --- TripSetupOriginStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 2 DE 5                                       │
│ ━━━━━━━━━━━━━                                │
│                                              │
│ ¿Desde dónde sales?                          │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ◎  Mi ubicación actual               ✓  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Tijuana, BC                                  │
│ México                                       │
│                                              │
│ O busca otro lugar                           │
│ ┌──────────────────────────────────────────┐ │
│ │ ⌕  Buscar origen en México...           │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-03
TripSetupOriginStep
```

### Tokens

``` text
Selection:      Cruze Mint
Surface:        Surface
Selected border: Cruze Mint
Radius:         12px
Padding:        16px
```

### Rule

Default origin is the established current location, but the user can
override it.

------------------------------------------------------------------------

# 12. `TR-SETUP-04` --- TripSetupTravelModeStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 3 DE 5                                       │
│ ━━━━━━━━━━━━━━━━━━━━━                        │
│                                              │
│ ¿Cómo vas a cruzar?                          │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │  👟  A pie                               │ │
│ │      Cruce peatonal                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │  🚗  Vehículo personal               ●  │ │
│ │      Cruce en auto                       │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │  🚛  Comercial                           │ │
│ │      Transporte / carga                  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-04
TripSetupTravelModeStep
```

### Tokens

``` text
Option surface: Surface
Selected surface: Surface Elevated
Selected border: Cruze Mint
Icon selected: Cruze Mint
Text: Text Primary
Secondary: Text Secondary
Radius:  8px
Gap: 12px
```

------------------------------------------------------------------------

# 13. Direction --- Derived State

Direction is a domain result, not a redundant user questionnaire when
origin and destination make it unambiguous.

### ASCII

``` text
ORIGIN                         DESTINATION
Tijuana, BC                    San Diego, CA
   🇲🇽                              🇺🇸
       └─────────── MX → US ───────────┘
                         │
                         ▼
                       NORTE
```

### Data

``` text
direction = MX_TO_US
```

### Visual token

``` text
Info Blue / Cruze Mint
```

The UI may expose the derived direction as context, but W5 should not
add an unnecessary standalone selection screen.

------------------------------------------------------------------------

# 14. `TR-SETUP-05` --- TripSetupVehicleAccessStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 4 DE 5                                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│                                              │
│ TIPO DE ACCESO                               │
│ ¿Qué tipo de acceso tienes?                  │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗  Estándar                         ○  │ │
│ │     Carriles generales                  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ⚡  Ready Lane                       ○  │ │
│ │     Carriles Ready Lane                 │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ◉   SENTRI                           ○  │ │
│ │     Carriles SENTRI                     │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-05
TripSetupVehicleAccessStep
```

### Tokens

``` text
Selected:       Cruze Mint
Option surface: Surface
Border:         #1F3A54
Selected border: Cruze Mint
Radius:         12px
Padding:        16px
```

### Values

``` text
STANDARD
READY_LANE
SENTRI
```

------------------------------------------------------------------------

# 15. `TR-SETUP-06` --- TripSetupDocumentProfileStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 5 DE 5                                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━            │
│                                              │
│ DOCUMENTO DE VIAJE                           │
│ ¿Qué documento utilizas para viajar?         │
│                                              │
│ Esto ayuda a filtrar opciones de acceso.     │
│ No necesitamos números de documentos.        │
│                                              │
│ ○  Pasaporte / documento de viaje             │
│ ○  Visa                                       │
│ ○  Ciudadano / residente de EE.UU.            │
│ ○  No estoy seguro                            │
│                                              │
│                    Omitir                    │
│                                              │
│              Ver recomendación →             │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-06
TripSetupDocumentProfileStep
```

### Tokens

``` text
Title:          Sora 24–28px / 700
Body:           Inter 16–18px
Option:         Surface
Selected:       Cruze Mint
Radio:          20–24px
Radius:         12px
Primary CTA:    Cruze Mint
Secondary:      Text Secondary
```

### Rules

Never collect:

``` text
Passport number
Document number
Credential
Sensitive document identifier
```

The profile is recommendation context, not legal eligibility
verification.

------------------------------------------------------------------------

# 16. `TR-NEAR-01` --- TripNearbyCrossingsSection

### ASCII

``` text
CERCA DE TI                              Ver todos →

Cruces relevantes ahora

┌──────────────────────────────────────────────┐
│ TR-NEAR-02                                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ TR-NEAR-02                                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ TR-NEAR-02                                   │
└──────────────────────────────────────────────┘

              Ver todos los cruces →
```

### Tokens

``` text
Section gap:       24–32px
Heading:           Sora / 16–18px / 700
Link:              Info Blue
Supporting text:   Text Secondary
```

### Rules

Maximum:

``` text
2–3 crossings
```

The section is not a duplicate of the Cruces directory.

------------------------------------------------------------------------

# 17. `TR-NEAR-02` --- TripNearbyCrossingRow

### ASCII

``` text
┌────────────────────────────────────────────────────────┐
│                                                        │
│  🚗   San Ysidro                         11 min       │
│       ● Abierto   Norte                2 min ago  →  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Required information

``` text
Crossing name
Operational status
Current wait
Direction
Freshness
```

Optional useful contextual metric:

``` text
Estimated travel time from current location
```

### Tokens

``` text
Surface:             transparent / Surface
Border:              1px #1F3A54
Radius:               8px
Padding:             16px
Name:                Sora 18–20px / 700
Wait:                Sora 28–32px / 600–700
Open:                Cruze Mint
Limited:             Amber
Closed:              Alert Red
Direction:           Text Secondary
Freshness:           Text Secondary
Chevron:             Text Secondary
```

### Do not include

``` text
Full lane details
Document requirements
Hours
Services
Address
Map
Detailed restrictions
```

Those belong to Crossing Detail.

------------------------------------------------------------------------

# 18. `CR-STATUS-01` --- CrossingStatusBadge

### ASCII

``` text
● Abierto
```

or

``` text
● Limitado
```

or

``` text
● Cerrado
```

### Semantic mapping

``` text
OPEN       → Cruze Mint
LIMITED    → Amber
CLOSED     → Alert Red
UNKNOWN    → Text Secondary
```

### Tokens

``` text
Pill radius: 999px
Height:      28–32px
Horizontal:  10–12px
Text:        Inter 13–14px / 600
```

------------------------------------------------------------------------

# 19. `CR-STATUS-02` --- CrossingDirectionTimes

### ASCII

``` text
Norte
11 min
```

or

``` text
Norte     11 min
Sur       4 min
```

### Tokens

``` text
Direction: Text Secondary
Metric:    Sora
```

------------------------------------------------------------------------

# 20. `CR-STATUS-03` --- CrossingWaitTime

### ASCII

``` text
11 min
```

### Tokens

``` text
Font:       Sora
Size:       28–40px depending on context
Weight:     600–700
Color:
  normal    Text Primary
  positive  Cruze Mint
  warning   Amber
```

This is one of the primary information metrics of the product.

------------------------------------------------------------------------

# 21. `CR-STATUS-04` --- CrossingWaitDelta

### ASCII

``` text
↓ 7 min
23 min faster
```

or:

``` text
↑ 12 min
```

### Tokens

``` text
Positive: Cruze Mint
Negative: Amber / Alert Red depending on severity
Neutral:  Text Secondary
```

Use this only when a valid comparison or temporal delta exists.

------------------------------------------------------------------------

# 22. `CR-STATUS-05` --- CrossingFreshness

### ASCII

``` text
Actualizado hace 2 min
```

### Freshness states

``` text
LIVE
RECENT
STALE
UNAVAILABLE
```

### Tokens

``` text
LIVE:        Cruze Mint
RECENT:      Text Secondary
STALE:       Amber
UNAVAILABLE: Text Secondary
```

### Critical rule

Operational state and freshness are independent.

Valid:

``` text
● Abierto
Actualizado hace 2 h
```

Invalid:

``` text
● Abierto
EN VIVO · Actualizado hace 2 h
```

------------------------------------------------------------------------

# 23. `TR-REC-01` --- TripRecommendationPrimaryCard

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ RECOMENDADO                                  │
│                                              │
│ San Ysidro                                   │
│ Ready Lane                                   │
│                                              │
│ 12 min              40 min total             │
│ Espera              Tiempo estimado          │
│                                              │
│ ● Abierto                                    │
│ Actualizado hace 2 min                       │
└──────────────────────────────────────────────┘
```

### Purpose

Primary decision surface.

### Tokens

``` text
Surface:          Surface Elevated
Border:           1px #1F3A54
Radius:           12px
Padding:          20–24px

Recommendation:
  Sora 12–14px / 700
  Cruze Mint

Crossing:
  Sora 28–34px / 700

Primary metric:
  Sora 36–48px / 700
  Cruze Mint

Secondary metric:
  Sora 20–28px / 600
  Text Primary
```

------------------------------------------------------------------------

# 24. `TR-REC-02` --- TripRecommendationReasonList

### ASCII

``` text
¿POR QUÉ ESTE CRUCE?

✓ Compatible con tu acceso
✓ Compatible con tu perfil
✓ Datos recientes
```

### Tokens

``` text
Heading:     Inter 12–14px / 700
Reason:      Inter 14–16px
Check:       Cruze Mint
Supporting:  Text Secondary
Gap:         8–12px
```

### Rule

Reasons should be data-derived and explain the recommendation rather
than merely decorate it.

------------------------------------------------------------------------

# 25. `TR-REC-03` --- TripAlternativeListSection

### ASCII

``` text
ALTERNATIVAS

┌──────────────────────────────────────────────┐
│ San Ysidro SENTRI                    8 min → │
├──────────────────────────────────────────────┤
│ Otay Mesa Ready                    18 min → │
├──────────────────────────────────────────────┤
│ Tecate Estándar                    35 min → │
└──────────────────────────────────────────────┘
```

### Tokens

``` text
Heading:    Sora / Inter 14–16px / 700
Rows:       Surface / transparent
Divider:    #1F3A54
Metric:     Sora 18–22px
Name:       Inter 15–17px / 600
```

------------------------------------------------------------------------

# 26. `TR-REC-04` --- TripAlternativeListRow

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ Otay Mesa Ready                     18 min → │
│ Norte · Abierto · Actualizado 3 min         │
└──────────────────────────────────────────────┘
```

### Tokens

``` text
Minimum height: 56–64px
Padding:        12–16px
Name:           Text Primary
Metadata:       Text Secondary
Wait:           Sora
Chevron:        Text Secondary
```

------------------------------------------------------------------------

# 27. `TR-ACT-01` --- TripStatusHeader

### ASCII

``` text
ACTIVE

San Ysidro
México → Estados Unidos

● Abierto
```

### Tokens

``` text
Status:      Cruze Mint
Primary:     Sora 24–32px
Secondary:   Inter 14–16px
```

------------------------------------------------------------------------

# 28. `TR-ACT-02` --- TripRouteSummary

### ASCII

``` text
Tijuana, BC
     │
     │  MX → US
     ▼
San Ysidro
     │
     ▼
San Diego, CA
```

### Tokens

``` text
Route:       Info Blue / Text Primary
Locations:   Text Primary
Supporting:  Text Secondary
```

------------------------------------------------------------------------

# 29. `TR-ACT-03` --- TripActionBar

### ASCII

``` text
┌──────────────────────────────────────────────┐
│   Ver cruce        Agente        Navegar     │
└──────────────────────────────────────────────┘
```

### Tokens

``` text
Height:       ≥56px
Primary:      Cruze Mint
Secondary:    Info Blue / Text Primary
Surface:      Surface Elevated
```

Actions should remain contextual to the active trip.

------------------------------------------------------------------------

# 30. `TR-ACT-04` --- TripChecklistSection

### ASCII

``` text
ANTES DE CRUZAR

✓ Cruce abierto
✓ Datos recientes
✓ Ruta disponible
✓ Documentos
✓ Acceso / carril
✓ Restricciones
```

### Tokens

``` text
Heading:    Sora / 16–18px / 700
Complete:   Cruze Mint
Pending:    Text Secondary
Warning:    Amber
Critical:   Alert Red
Row height: 48–56px
```

------------------------------------------------------------------------

# 31. `TR-COMP-01` --- TripCompletionPrompt

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ¿Ya cruzaste?                               │
│                                              │
│ Marca tu viaje como completado.              │
│                                              │
│ [ Completar viaje ]                          │
│ [ Ahora no ]                                 │
└──────────────────────────────────────────────┘
```

### Tokens

``` text
Surface:     Surface Elevated
Radius:      12px
Primary CTA: Cruze Mint
Secondary:   Text Secondary
```

------------------------------------------------------------------------

# 32. Primitive Composition

## Destination

``` text
TR-SETUP-02
├── CruzeBackHeader
├── TripSetupProgress
├── SearchInput
├── Result rows
└── Button
```

## Travel mode

``` text
TR-SETUP-04
├── CruzeBackHeader
├── TripSetupProgress
├── RadioGroup
│   ├── A pie
│   ├── Vehículo personal
│   └── Comercial
└── Button
```

## Recommendation

``` text
TR-REC-01
├── RecommendationBadge
├── CrossingWaitTime
├── CrossingStatusBadge
└── CrossingFreshness

TR-REC-02
├── RecommendationReason
├── RecommendationReason
└── RecommendationReason

TR-REC-03
└── TR-REC-04 × N
```

------------------------------------------------------------------------

# 33. W5 Component Inventory

``` text
APP-HEAD-01   CruzeAppHeader
APP-AV-01     CruzeNotificationButton
APP-SET-01    CruzeSettingsButton
APP-NAV-01    CruzeBottomNav

LOC-STATUS-01 LocationStatusBanner

TR-EMPTY-01   TripEmptyActionPanel
TR-NEAR-01    TripNearbyCrossingsSection
TR-NEAR-02    TripNearbyCrossingRow

TR-SETUP-01   TripSetupProgress
TR-SETUP-02   TripSetupDestinationStep
TR-SETUP-03   TripSetupOriginStep
TR-SETUP-04   TripSetupTravelModeStep
TR-SETUP-05   TripSetupVehicleAccessStep
TR-SETUP-06   TripSetupDocumentProfileStep

TR-REC-01     TripRecommendationPrimaryCard
TR-REC-02     TripRecommendationReasonList
TR-REC-03     TripAlternativeListSection
TR-REC-04     TripAlternativeListRow

TR-ACT-01     TripStatusHeader
TR-ACT-02     TripRouteSummary
TR-ACT-03     TripActionBar
TR-ACT-04     TripChecklistSection
TR-COMP-01    TripCompletionPrompt

CR-STATUS-01  CrossingStatusBadge
CR-STATUS-02  CrossingDirectionTimes
CR-STATUS-03  CrossingWaitTime
CR-STATUS-04  CrossingWaitDelta
CR-STATUS-05  CrossingFreshness
```

------------------------------------------------------------------------

# 34. Global Visual Hierarchy

Every W5 screen should follow:

``` text
01  APP CONTEXT
        ↓
02  SCREEN / USER INTENT
        ↓
03  PRIMARY DECISION
        ↓
04  PRIMARY METRIC
        ↓
05  OPERATIONAL STATE
        ↓
06  FRESHNESS
        ↓
07  EXPLANATION / EVIDENCE
        ↓
08  SECONDARY OPTIONS
        ↓
09  PRIMARY ACTION
```

Do not make every element visually loud.

Mint is a semantic accent, not a decorative color.

------------------------------------------------------------------------

# 35. Canonical Shell

``` text
┌──────────────────────────────────────────────┐
│ CRUZE                              🔔    ⚙  │
├──────────────────────────────────────────────┤
│                                              │
│                BODY GRADIENT                 │
│                                              │
│               SCREEN CONTENT                 │
│                                              │
├──────────────────────────────────────────────┤
│       Viaje          Cruces          Agente  │
└──────────────────────────────────────────────┘
```

The header and bottom navigation are shared shell components;
screen-specific components live inside the body composition.

------------------------------------------------------------------------

# 36. Source Alignment Notes

The specification establishes:

-   Exactly three primary destinations: Viaje, Cruces and Agente.
-   Avisos through the header bell.
-   Settings through the header gear.
-   Viaje as the personalized decision surface.
-   T01 as the default landing surface.
-   2--3 nearby crossings maximum.
-   Nearby crossing previews containing crossing name, status, wait,
    direction and freshness.
-   Crossing Detail as the place for full lane information, documents,
    hours, services, address, map and detailed restrictions.
-   Trip Setup as a dynamic flow rather than fixed onboarding screens.
-   Destination, origin and travel mode as the base trip requirements.
-   Private northbound access and optional document profile as
    conditional enrichment.
-   Sora for display/hero/numeric emphasis and Inter for
    UI/body/metadata.
-   The canonical color, spacing, radius, border and touch-target tokens
    used throughout this document.

The source does **not** define a formal CSS body-gradient token. The
gradient in Section 2 is therefore explicitly marked as a visual
implementation approximation derived from the supplied visual reference,
not as a canonical design-system foundation.

------------------------------------------------------------------------

# 37. Implementation Principle

The component hierarchy should remain:

``` text
FOUNDATIONS
     ↓
PRIMITIVES
     ↓
DOMAIN COMPONENTS
     ↓
SCREEN COMPOSITIONS
     ↓
WORKFLOW
```

W5 should therefore not implement visual styles independently inside
each screen.

For example:

``` text
T01
 └── TR-NEAR-02
      └── CR-STATUS-01
      └── CR-STATUS-03
      └── CR-STATUS-05
```

The same status components should render consistently in:

``` text
Viaje
Cruces
Recommendation
Agent
Avisos
Active Trip
```

This keeps the visual language deterministic across the product.