/**
 * CRUZE minimal service worker (PWA installability + offline shell).
 *
 * - Precache: app shell routes so a home-screen launch works offline.
 * - Runtime: same-origin GETs are cached on success (stale-while-revalidate
 *   behavior for pages/assets; API freshness is handled by the app's own
 *   freshness thresholds, not the cache).
 * - Fallback: failed navigations resolve to the cached Spanish shell.
 * - No push (backend keys live in SYNC-01 territory). Version the cache
 *   name to invalidate: cruze-shell-v<N>.
 */

const CACHE = "cruze-shell-v1";
const SHELL = ["/", "/es", "/en"];
const OFFLINE_FALLBACK = "/es";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => {
        // First install may be offline — runtime caching still applies.
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  let sameOrigin = true;
  try {
    sameOrigin = new URL(request.url).origin === self.location.origin;
  } catch {
    return;
  }
  if (!sameOrigin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit || caches.match(OFFLINE_FALLBACK))
      )
  );
});
