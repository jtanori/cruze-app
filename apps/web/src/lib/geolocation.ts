export interface GeolocationResult {
  lat: number;
  lng: number;
  accuracy: number;
}

function isSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.geolocation;
}

export function requestGeolocation(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!isSupported()) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

export function checkGeolocationPermission(): Promise<PermissionState> {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return Promise.resolve("prompt");
  }
  return navigator.permissions
    .query({ name: "geolocation" } as PermissionDescriptor)
    .then((result) => result.state)
    .catch(() => "prompt" as PermissionState);
}

export function watchGeolocationPermission(
  callback: (state: PermissionState) => void
): (() => void) | null {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return null;
  }
  let status: PermissionStatus | null = null;
  let handler: (() => void) | null = null;
  let active = true;

  navigator.permissions
    .query({ name: "geolocation" } as PermissionDescriptor)
    .then((result) => {
      if (!active) return;
      status = result;
      callback(result.state);
      handler = () => {
        callback(result.state);
      };
      // Single subscription mechanism: prefer addEventListener, fall back to onchange.
      if (typeof result.addEventListener === "function") {
        result.addEventListener("change", handler as EventListener);
      } else {
        (result as unknown as { onchange: (() => void) | null }).onchange = handler;
      }
    })
    .catch(() => {});

  return () => {
    active = false;
    if (status && handler) {
      try {
        if (typeof status.removeEventListener === "function") {
          status.removeEventListener("change", handler as EventListener);
        }
        const s = status as unknown as { onchange?: (() => void) | null };
        if (s.onchange === (handler as unknown as () => void)) s.onchange = null;
      } catch {}
    }
  };
}
