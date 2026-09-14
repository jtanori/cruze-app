/**
 * Shared short-form freshness: "Hace X min" / "Ahora" (es),
 * "Updated …" (en). Single source for rows, tables, badges.
 */

export interface FreshnessTranslator {
  (key: "common.justNow"): string;
  (key: "common.minutesAgo" | "common.hoursAgo", params: { count: number }): string;
  (key: "common.updated", params: { time: string }): string;
}

export function freshnessMinutes(lastUpdated: number): number {
  return Math.max(0, Math.floor((Date.now() - lastUpdated) / 60000));
}

export function formatFreshness(
  lastUpdated: number,
  t: FreshnessTranslator
): string {
  const minutes = freshnessMinutes(lastUpdated);
  const text =
    minutes < 1
      ? t("common.justNow")
      : minutes < 60
        ? t("common.minutesAgo", { count: minutes })
        : t("common.hoursAgo", { count: Math.floor(minutes / 60) });
  return t("common.updated", { time: text });
}
