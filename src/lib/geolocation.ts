export interface GeolocationResult {
  lat: number;
  lng: number;
  accuracy: number;
}

export function requestGeolocation(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

export function checkGeolocationPermission(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return Promise.resolve("prompt");
  }
  return navigator.permissions
    .query({ name: "geolocation" })
    .then((result) => result.state);
}
