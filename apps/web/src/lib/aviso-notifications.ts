import type { Aviso } from "./avisos";

/**
 * P4 — Critical aviso system notifications.
 *
 * Fires a Web Notification for unread, non-dismissed, critical-severity
 * avisos the user hasn't been notified about yet. Permission must be
 * granted via an explicit user gesture (alerts page enable button).
 * All browser APIs are guarded for SSR/test environments.
 */

export type AvisoNotificationPermission =
  | "default"
  | "denied"
  | "granted"
  | "unsupported";

const SEEN_KEY = "cruze-notified-avisos";

function hasNotificationAPI(): boolean {
  return typeof Notification !== "undefined";
}

export function getNotificationPermission(): AvisoNotificationPermission {
  if (!hasNotificationAPI()) return "unsupported";
  return Notification.permission as AvisoNotificationPermission;
}

export async function requestNotificationPermission(): Promise<AvisoNotificationPermission> {
  if (!hasNotificationAPI()) return "unsupported";
  if (Notification.permission !== "default") {
    return Notification.permission as AvisoNotificationPermission;
  }
  try {
    const result = await Notification.requestPermission();
    return result as AvisoNotificationPermission;
  } catch {
    return getNotificationPermission();
  }
}

/** Critical, unread, non-dismissed, and not yet notified. */
export function filterNotifiableAvisos(avisos: Aviso[], seenIds: Set<string>): Aviso[] {
  return avisos.filter(
    (a) =>
      a.severity === "critical" &&
      !a.read &&
      !a.dismissed &&
      !seenIds.has(a.id)
  );
}

export function loadSeenIds(): Set<string> {
  try {
    if (typeof localStorage === "undefined") return new Set();
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((x) => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

export function saveSeenIds(ids: Set<string>): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
  } catch {
    // Storage full or blocked — notifications still fire, dedup just won't persist.
  }
}

export function notifyAviso(
  aviso: Aviso,
  opts?: { onClick?: () => void }
): boolean {
  if (!hasNotificationAPI()) return false;
  if (Notification.permission !== "granted") return false;
  try {
    const notification = new Notification(aviso.title, {
      body: aviso.description,
      tag: `cruze-aviso-${aviso.id}`,
    });
    if (opts?.onClick) {
      notification.onclick = (e) => {
        e.preventDefault();
        opts.onClick?.();
      };
    }
    return true;
  } catch {
    return false;
  }
}
