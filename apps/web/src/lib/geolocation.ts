export interface GeolocationResult {
  lat: number;
  lng: number;
  accuracy: number;
}

export function requestGeolocation(): Promise<GeolocationResult> {
  console.log("[Cruze:Geo] requestGeolocation() called");
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error("[Cruze:Geo] Geolocation API not supported by browser");
      reject(new Error("Geolocation not supported"));
      return;
    }

    console.log("[Cruze:Geo] Calling getCurrentPosition (timeout: 10s, highAccuracy: true)");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("[Cruze:Geo] getCurrentPosition success:", {
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
          accuracy: position.coords.accuracy,
        });
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error("[Cruze:Geo] getCurrentPosition error:", error.code, error.message);
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
  console.log("[Cruze:Geo] checkGeolocationPermission()");
  if (!navigator.permissions) {
    console.log("[Cruze:Geo] navigator.permissions not available → returning 'prompt'");
    return Promise.resolve("prompt");
  }
  return navigator.permissions
    .query({ name: "geolocation" })
    .then((result) => {
      console.log("[Cruze:Geo] Permission query result:", result.state);
      return result.state;
    });
}
