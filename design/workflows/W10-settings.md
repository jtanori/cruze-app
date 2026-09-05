# W10 — Settings Workflow Specification

## Overview
| Field | Value |
|-------|-------|
| **Workflow ID** | W10 |
| **Name** | Settings Root → Profile / Favorites / My Trips / Data Sharing / About |
| **Spec Sections** | §10-11, §47-50, §104 |
| **Pages** | S01 → S02/S03/S04/S05/S06 |
| **Branching** | Hub → 5 leaves isolated by design |

## Flow Diagram
```mermaid
flowchart TD
    A[APP-SET-01 Gear] --> B[S01 SettingsList]
    B --> C[S02 Profile SET-PROFILE-01]
    B --> D[S03 Favorites SET-FAV-01]
    B --> E[S04 My Trips SET-TRIP-01 COMPLETED only]
    B --> F[S05 Data Sharing SET-DATA-01 Placeholder]
    B --> G[S06 About SET-ABOUT-01]
```

## Page Sequence
| Step | Page ID | Page | Key Actions | Next |
|------|---------|------|-------------|------|
| 1 | S01 | Root | SET-ROOT-01 + SET-SEC-01 PERFIL/GUARDADOS/PRIVACIDAD/INFORMACIÓN | → S02-S06 |
| 2 | S02 | Profile | Travel Mode Access Document Trusted Traveler no numbers | End |
| 3 | S03 | Favorites | Saved crossings San Luis/Lukeville/Nogales via CR-DET-09 | End |
| 4 | S04 | My Trips | COMPLETED only Puerto Peñasco→Los Angeles | End |
| 5 | S05 | Data Sharing | Compartir Datos Próximamente no controls | End |
| 6 | S06 | About | Términos Privacidad Legal Fuentes Versión | End |

## Component Catalog
| Component ID | Name | Responsibility |
|--------------|------|----------------|
| SET-ROOT-01 | SettingsList | Root container |
| SET-SEC-01 | SettingsSection | Section divider |
| SET-PROFILE-01 | ProfileSettings | Local profile |
| SET-FAV-01 | FavoriteCrossingsList | Saved crossings |
| SET-TRIP-01 | SavedTripsList | Mis viajes COMPLETED only |
| SET-DATA-01 | DataSharingPlaceholder | Placeholder |
| SET-ABOUT-01 | AboutLinksList | Legal surface |

## Files Reference
| File | Purpose |
|------|---------|
| src/app/[locale]/settings/page.tsx | S01 |
| src/app/[locale]/settings/profile/page.tsx | S02 |
| src/app/[locale]/settings/favorites/page.tsx | S03 |
| src/app/[locale]/settings/trips/page.tsx | S04 |
| src/app/[locale]/settings/data-sharing/page.tsx | S05 |
| src/app/[locale]/settings/about/page.tsx | S06 |
