# CRUCE — Own Border Data API (Brief)
> **Companion:** Implementation source of truth: `design/components/README.md` (84) + `design/workflows/W*.md` + `design/INTEGRATION_PLAN.md` Addendum. Testing: `docs/TESTING_TOOLS.md` → `design/TESTING_INTEGRATION_PLAN.md`. This doc is **strategy/brief only** — not an implementation spec.


**Purpose:** Explore filling the Mexican-side / southbound data gap. Discussion starter only — not a build plan.

## The gap

- **Northbound (MX→US):** Official public feed exists (CBP JSON).
- **Southbound (US→MX):** Partial official coverage in California only (Caltrans KML for San Ysidro / Otay approaches). No public ANAM/SAT/INM queue API nationwide.
- **Community apps** (Bordify, Tijuana Good News, etc.) blend CBP with user reports but do not expose stable public APIs.

Owning a feed would let CRUCE (and partners) rank trips in both directions with first-party confidence — especially outside CA and for southbound commercial.

## What “our API” would expose

Minimum viable product:

| Field | Notes |
|-------|--------|
| `crossing_id`, direction | e.g. san-ysidro / southbound |
| `observed_at` | ISO timestamp |
| `wait_minutes` (or band) | Per mode if possible: standard / ready / sentri / pedestrian |
| `sample_size` / method | GPS probe, camera CV, booth sensor, user check-in |
| `confidence` | 0–100 derived from method + freshness + n |
| `lanes_open` (optional) | If observable |

Versioned JSON over HTTPS; read-heavy; auth for write/ingest.

## Technical requirements (sketch)

1. **Ingest**
   - Mobile SDK / app check-ins (arrival at queue end → booth).
   - Optional: roadside cameras + CV (privacy-heavy).
   - Optional: partnerships (parking operators, SENTRI operators, munis).
2. **Pipeline**
   - Stream or batch into time-series store (e.g. Postgres + hypertables / BigQuery).
   - Aggregation window (e.g. last 10–15 min median per lane class).
   - Outlier rejection; bot/fraud scoring on user reports.
3. **Serve**
   - Edge-cached GET endpoints; rate limits; API keys for B2B.
   - SLOs: freshness p95 < 10 min at major POEs during peak.
4. **Ops**
   - Observability on lag, coverage %, abuse.
   - Fall back to CBP/Caltrans when own sample is thin (same pattern as current engine).

## Physical / field requirements

- **Pilot geography:** Start San Ysidro + Otay only; expand Tecate → Calexico later.
- **Hardware (if not phone-only):** fixed cameras need power, network, mounting rights on MX or US approach roads; customs/municipio coordination.
- **Human ops:** seed period of paid or incentivized reporters to reach minimum n per hour-band.

## Legal & policy (high level — not legal advice)

- **Location data:** consent, retention limits, purpose limitation (Mexico LFPDPPP / US state privacy; GDPR if EU users).
- **Cameras:** signage, no face retention if possible; avoid license-plate storage unless contracted and justified.
- **Government relations:** publishing “official-looking” waits can attract attention from CBP/ANAM; frame as independent traveler intelligence, not government data.
- **Terms of scavenged data:** do not republish CBP/Caltrans as “CRUCE exclusive”; keep provenance labels.
- **Liability:** estimates only; disclaim reliance for commercial dispatch / emergency.

## Cost order-of-magnitude (discussion)

| Phase | Rough focus |
|-------|-------------|
| Phone-report MVP | App incentives + backend + moderation |
| CV pilot (1–2 approaches) | Hardware + install permits + model ops |
| B2B API | Keys, billing, SLA, support |

Exact numbers depend on whether CRUCE stays consumer-only or sells data.

## Open questions for later discussion

1. Phone-only vs camera-assisted in v1?
2. Incentives: points, Pro unlock, cash, partnership with local brands?
3. Data licensing: free tier vs paid commercial redistribution?
4. Binational entity / MX subsidiary needed for camera rights?
5. How hard to merge own signal into existing `resolveLiveSnapshot` provenance chain?

---

*Status: brief for product/legal/ops discussion. No implementation commitment.*
