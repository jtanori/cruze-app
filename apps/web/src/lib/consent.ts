import type { ConsentRecord, ConsentType } from "@/types/monetization";

/**
 * S2 — Consent policy versioning.
 *
 * Grants are bound to the policy text version shown at consent time.
 * Bumping CONSENT_POLICY_VERSION invalidates older grants so users
 * re-consent against current copy (hasConsent enforces the match).
 */
export const CONSENT_POLICY_VERSION = "2026-09";

export function isConsentCurrent(record: ConsentRecord): boolean {
  return record.version === CONSENT_POLICY_VERSION;
}

/** Latest record wins; stale versions and missing records read as denied. */
export function latestConsentFor(
  records: ConsentRecord[],
  type: ConsentType
): ConsentRecord | null {
  const matches = records
    .filter((r) => r.type === type)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return matches[0] ?? null;
}
