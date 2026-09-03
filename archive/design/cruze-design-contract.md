# CRUZE DESIGN CONTRACT
**Version:** 1.0.0  
**Source of Truth:** Cruze Design Board & Visual Identity Specifications  
**Authority:** Mandatory across all implementation and migration phases.

---

## 1. Design Tokens

### 1.1 Background & Surfaces

| Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| `background` | `#081830` | Primary application canvas; deep navy used across all views |
| `surface` | `#0C1C34` | Standard cards, input containers, list rows |
| `surface-elevated` | `#14243A` | Elevated cards, bottom navigation, selected controls, sheets |
| `surface-subtle` | `#1A2A40` | Secondary containers, chart tracks, segmented backgrounds |
| `canvas-light` | `#F8F8F8` | Documentation / brand presentation surface |
| `white` | `#FFFFFF` | Primary high-contrast text, inverse controls |

### 1.2 Text Hierarchy

| Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| `ink` | `#F5F7FA` | Primary text, titles, large data numbers, active states |
| `muted` | `#A8B3C2` | Secondary labels, descriptions, supporting metrics |
| `faint` | `#68788B` | Timestamps, metadata, inactive tab icons & labels |
| `ink-dark` | `#081830` | Text on light/white surfaces |

### 1.3 Brand Palette

| Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| `brand` | `#148F79` | Primary Cruze teal/green; key actions, active highlights |
| `brand-dark` | `#075F55` | Pressed/active state brand accent |
| `brand-light` | `#BFE3DB` | Soft brand highlights and low-emphasis accents |
| `brand-bright` | `#22A886` | Active chart trend lines, positive indicators |
| `mexico-green` | `#087F67` | Logo arch - Mexican green accent |
| `mexico-red` | `#E3262E` | Logo arch - Mexican red accent |
| `us-blue` | `#102A4C` | Logo bridge structure / US blue |

### 1.4 Status System

| Status State | Foreground Token | Foreground Hex | Background Soft Token | Background Soft Hex | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Improving / Normal** | `improving` | `#22924A` | `success-soft` | `#143E32` | Faster wait times, open lanes, normal conditions |
| **Caution** | `caution` | `#F4A01B` | `caution-soft` | `#44351A` | Moderate delays, partial lane capacity |
| **Congested** | `congested` | `#F47722` | `congested-soft` | `#482A1A` | Significant delays, bottleneck |
| **Critical / SOS** | `critical` | `#E33332` | `critical-soft` | `#421D26` | Severe wait, emergency, closed lanes |
| **Info / Neutral** | `info` | `#2E9DD6` | `info-soft` | `#152F43` | Informational badges, CBP metadata |

### 1.5 Borders & Dividers

| Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| `border` | `#26374B` | Standard 1px component border |
| `border-subtle` | `#1D2D42` | List separators, table gridlines |
| `border-strong` | `#3A4A5D` | Focused inputs, selected segmented items |
| `rule` | `#314154` | Section dividers |

### 1.6 Map Canvas Tokens

| Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| `map-background` | `#08182D` | Dark map canvas surface |
| `map-road` | `#263A50` | Primary road vectors |
| `map-road-secondary`| `#344B62` | Secondary road vectors |
| `map-boundary` | `#31595B` | US-Mexico border & regional boundaries |
| `map-route` | `#24A8E0` | Active recommended route line (cyan glow) |
| `map-route-secondary`| `#148F79` | Alternative route lines |

---

## 2. Typography

### 2.1 Font Family
```css
font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### 2.2 Numerical Formatting
```css
font-variant-numeric: tabular-nums;
```
*Mandatory* for all wait times, minutes, timestamps, percentages, and comparison metrics.

### 2.3 Type Scale

| Role | Font Size | Line Height | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| `label-xs` | `10px` | `14px` | 500 (Medium) | +0.02em |
| `label-sm` | `11px` | `15px` | 500 (Medium) | +0.01em |
| `body-sm` | `12px` | `17px` | 400 (Regular) | normal |
| `body` | `14px` | `20px` | 400 (Regular) | normal |
| `body-lg` | `16px` | `22px` | 400 (Regular) | normal |
| `data-sm` | `18px` | `22px` | 600 (Semibold) | normal (tabular) |
| `data` | `24px` | `28px` | 600 (Semibold) | -0.01em (tabular) |
| `data-lg` | `32px` | `36px` | 700 (Bold) | -0.02em (tabular) |
| `display-sm` | `28px` | `32px` | 700 (Bold) | -0.02em |
| `display` | `36px` | `40px` | 700 (Bold) | -0.03em |
| `display-lg` | `44px` | `48px` | 800 (ExtraBold) | -0.04em |

---

## 3. Shape & Elevation

### 3.1 Radii
| Token | Value | Target Usage |
| :--- | :--- | :--- |
| `sm` | `6px` | Compact tag pills, micro indicators |
| `md` | `10px` | Primary/Secondary buttons, form inputs, segmented control chips |
| `lg` | `10px` | Standard cards, evidence thumbnails, metric containers (lowered globally from 14px) |
| `xl` | `20px` | Large cards, hero decision containers |
| `2xl` | `28px` | App bottom sheets, major modal dialogs |
| `full` | `9999px` | Status badges, chips, circular action buttons |

### 3.2 Elevation & Shadows
The UI is intentionally **low-shadow** and high-clarity. Depth is achieved primarily via surface color contrast and 1px border rules.
- `shadow-sm`: `0 2px 8px rgba(0, 0, 0, 0.18)`
- `shadow-md`: `0 8px 24px rgba(0, 0, 0, 0.24)`
- `shadow-lg`: `0 16px 40px rgba(0, 0, 0, 0.30)`

---

## 4. Navigation Standards

### 4.1 Top App Bar
- **Height:** 48–56px
- **Background:** `background` (`#081830`) or transparent
- **Title:** `11–12px`, uppercase, `font-semibold` (600), `tracking-wider`, `text-ink`
- **Actions/Back Touch Target:** Minimum 36–40px square hit target
- **Divider:** None by default; 1px `border-subtle` only when content requires scroll separation

### 4.2 Bottom Navigation Bar
- **Height:** 64–72px + `env(safe-area-inset-bottom)`
- **Background:** `surface-elevated` (`#14243A`)
- **Top Border:** 1px solid `border` (`#26374B`)
- **Shadow:** None
- **3 Exact Destinations (authoritative — `Mapa`, `Actividad`, `Más` removed per master plan):**
   1. `Cruces` (`/crossings`) → Icon: Compass / Home
   2. `Favoritos` (`/favorites`) → Icon: Heart / Bookmark
   3. `Alertas` (`/alerts`) → Icon: Bell (with unread badge)
- **Icon Size:** 18–22px
- **Label Size:** `10–12px`, `font-medium`
- **Colors:** Inactive: `muted` (`#A8B3C2`); Active: `ink` (`#F5F7FA`) text + `brand-green` (`#43D69A`) icon, with a subtle top indicator bar (`20–24px` wide, `2–3px` high)

---

## 5. Primitive Specifications

### 5.1 Primary Button
- **Height:** 42–44px
- **Background:** `brand` (`#148F79`), hover/pressed: `brand-dark` (`#075F55`)
- **Text:** `white`, `13px`, `font-semibold` (600)
- **Radius:** `10px` (`radius-md`)
- **Horizontal Padding:** `16px`

### 5.2 Secondary Button
- **Height:** 42–44px
- **Background:** `surface-elevated` (`#14243A`)
- **Border:** 1px solid `border` (`#26374B`)
- **Text:** `ink` (`#F5F7FA`), `13px`, `font-medium` (500)
- **Radius:** `10px` (`radius-md`)

### 5.3 Status Pills / Badges
- **Height:** 20–24px
- **Padding:** `4px 8px`
- **Radius:** `9999px` (`rounded-full`)
- **Font Size:** `10–11px`, `font-semibold` (600)
- **Backgrounds:** Strictly use soft translucent fills (`success-soft`, `caution-soft`, `congested-soft`, `critical-soft`, `info-soft`).

---

## 6. Forbidden Patterns & Anti-Slop Rules

1. **NO Light-Mode Bleed:** Never introduce white container backgrounds or gray text on colored backgrounds.
2. **NO Arbitrary Floating Glows:** Glowing shadows are restricted strictly to the active map route line, live beacon dot, and critical SOS pulse.
3. **NO Text Reconstruction for Logos:** Never recreate the Cruze bridge logo as CSS shapes or font approximations. Use official SVG assets.
4. **NO Nested Pill Overload:** Do not place pills inside cards inside rounded pills.
5. **NO Skipping Semantic Weights:** Data values must use `tabular-nums` and bold/semibold weights.
