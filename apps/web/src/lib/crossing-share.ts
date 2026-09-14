/**
 * Crossing share payload (C03 ↗) — pure builder, omission-safe.
 *
 * Never constructs from assumed fields: unknown status renders an
 * explicit "unknown" line, missing waits/freshness are omitted.
 * Operational state and freshness stay separate dimensions.
 */

export interface CrossingShareInput {
  id: string;
  name: string;
  locale: string;
  /** Localized status label, or null when unknown. */
  statusLabel: string | null;
  /** Localized "unknown status" line (e.g. "Estado desconocido"). */
  unknownStatusLabel: string;
  /** Localized direction labels. */
  northLabel: string;
  southLabel: string;
  waitNorthbound: number | null;
  waitSouthbound: number | null;
  /** Precomputed short freshness (e.g. "Hace 2 min"), or null to omit. */
  freshnessText: string | null;
  /** "Ver en CRUZE" line. */
  viewInLabel: string;
  baseUrl?: string;
}

export interface CrossingSharePayload {
  title: string;
  text: string;
  url: string;
}

const DEFAULT_BASE_URL = "https://cruze.com.mx";

export function buildCrossingSharePayload(
  input: CrossingShareInput
): CrossingSharePayload {
  const {
    id,
    name,
    locale,
    statusLabel,
    unknownStatusLabel,
    northLabel,
    southLabel,
    waitNorthbound,
    waitSouthbound,
    freshnessText,
    viewInLabel,
    baseUrl = DEFAULT_BASE_URL,
  } = input;

  const url = `${baseUrl}/${locale}/crossing/${id}`;
  const lines: string[] = [name, ""];

  lines.push(statusLabel ? `● ${statusLabel}` : `● ${unknownStatusLabel}`);

  const waits: string[] = [];
  if (waitNorthbound !== null) waits.push(`${northLabel} ${waitNorthbound} min`);
  if (waitSouthbound !== null) waits.push(`${southLabel} ${waitSouthbound} min`);
  if (waits.length > 0) lines.push(waits.join(" · "));

  if (freshnessText) lines.push(freshnessText);

  lines.push("", viewInLabel, url);

  return {
    title: name,
    text: lines.join("\n"),
    url,
  };
}
