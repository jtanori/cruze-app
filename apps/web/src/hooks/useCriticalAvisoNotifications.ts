"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Aviso } from "../lib/avisos";
import {
  filterNotifiableAvisos,
  getNotificationPermission,
  loadSeenIds,
  notifyAviso,
  requestNotificationPermission,
  saveSeenIds,
  type AvisoNotificationPermission,
} from "../lib/aviso-notifications";

/**
 * P4 — Watch active avisos and fire a system notification once per
 * critical aviso (deduped by id, persisted across reloads).
 * Only fires while permission is granted; never prompts by itself.
 */
export function useCriticalAvisoNotifications(activeAvisos: Aviso[]) {
  const [permission, setPermission] =
    useState<AvisoNotificationPermission>("default");
  const seenRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    setPermission(getNotificationPermission());
    seenRef.current = loadSeenIds();
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;
    if (seenRef.current === null) seenRef.current = loadSeenIds();
    const fresh = filterNotifiableAvisos(activeAvisos, seenRef.current);
    if (fresh.length === 0) return;
    let changed = false;
    for (const aviso of fresh) {
      if (notifyAviso(aviso)) {
        seenRef.current.add(aviso.id);
        changed = true;
      }
    }
    if (changed) {
      saveSeenIds(seenRef.current);
    }
  }, [activeAvisos, permission]);

  const request = useCallback(async () => {
    const next = await requestNotificationPermission();
    setPermission(next);
    return next;
  }, []);

  return { permission, requestPermission: request };
}
