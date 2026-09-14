/**
 * Map route primitives — pure functions for Mapbox route overlay.
 * Extracted from CrossingIntelligenceView for reuse in CrossingDetailMap.
 * No React dependencies — operates on raw mapboxgl.Map instances.
 */
import mapboxgl from "mapbox-gl";

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

/**
 * Fetch driving route coordinates via the server directions proxy.
 * S2: coordinates stay same-origin; the token lives server-side.
 * The legacy token param is accepted but ignored (kept for call-site compat).
 */
export async function fetchDirectionsRoute(
  start: [number, number],
  end: [number, number],
  _token?: string
): Promise<[number, number][]> {
  const params = new URLSearchParams({
    start: `${start[0]},${start[1]}`,
    end: `${end[0]},${end[1]}`,
  });
  const response = await fetch(`/api/directions?${params.toString()}`);
  const data = await response.json();
  if (Array.isArray(data.coordinates) && data.coordinates.length > 0) {
    return data.coordinates;
  }
  return [start, end];
}

/** Draw a two-layer route (glow + solid) on the map. */
export function drawRouteLayers(
  map: mapboxgl.Map,
  coordinates: [number, number][]
): void {
  map.addSource("cruze-route", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    },
  });

  map.addLayer({
    id: "cruze-route-glow",
    type: "line",
    source: "cruze-route",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": "#43E0B0",
      "line-width": 6,
      "line-opacity": 0.25,
      "line-blur": 4,
    },
  });

  map.addLayer({
    id: "cruze-route-line",
    type: "line",
    source: "cruze-route",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": "#43E0B0",
      "line-width": 3,
    },
  });
}

/** Fit map bounds to encompass origin, crossing, and destination. */
export function fitJourneyBounds(
  map: mapboxgl.Map,
  origin: MapPoint,
  crossing: MapPoint,
  destination: MapPoint
): void {
  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend([origin.lng, origin.lat]);
  bounds.extend([crossing.lng, crossing.lat]);
  bounds.extend([destination.lng, destination.lat]);
  map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
}

/**
 * Create a labeled marker element.
 *
 * SECURITY: `label` comes from trip store data (Mapbox place names + user
 * selection) and must never be interpolated into HTML. The static shell is
 * template markup; the label is attached via textContent only. Color/align
 * are constrained to safe values even though callers are internal.
 */
export function createLabeledMarker(
  label: string,
  color: string,
  align: "left" | "right"
): mapboxgl.Marker {
  const safeColor = /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#FFFFFF";
  const side = align === "left" ? "left" : "right";
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: flex-${side};">
      <div style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(7, 26, 49, 0.85); backdrop-filter: blur(8px); border-radius: 9999px; border: 1px solid rgba(31, 58, 90, 0.5); white-space: nowrap;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${safeColor};"></div>
        <span data-marker-label="true" style="color: #FFFFFF; font-size: 11px; font-weight: 500; font-family: Inter, sans-serif;"></span>
      </div>
      <svg style="margin-${side === "left" ? "left" : "right"}: 12px;" viewBox="0 0 24 32" width="24" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="${safeColor}"/>
        <circle cx="12" cy="12" r="5" fill="#081830"/>
      </svg>
    </div>
  `;
  const labelSpan = el.querySelector("[data-marker-label]");
  if (labelSpan) labelSpan.textContent = label;
  return new mapboxgl.Marker({ element: el, anchor: side === "left" ? "bottom-left" : "bottom-right" });
}

/** Create the pulsing crossing gate marker. */
function createCrossingMarker(): mapboxgl.Marker {
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="position: relative; width: 28px; height: 28px;">
      <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(67, 214, 154, 0.4); animation: cruze-pulse 2s infinite;"></div>
      <div style="position: absolute; inset: 4px; border-radius: 50%; background: #43D69A; border: 2px solid #FFFFFF;"></div>
    </div>
    <style>
      @keyframes cruze-pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.4); opacity: 0; }
      }
    </style>
  `;
  return new mapboxgl.Marker({ element: el });
}

/** Add journey markers (origin, crossing, destination) to the map. */
export function addJourneyMarkers(
  map: mapboxgl.Map,
  origin: MapPoint,
  crossing: MapPoint,
  destination: MapPoint
): void {
  if (origin.label) {
    createLabeledMarker(origin.label, "#FFFFFF", "left")
      .setLngLat([origin.lng, origin.lat])
      .addTo(map);
  }

  if (destination.label) {
    createLabeledMarker(destination.label, "#43D69A", "right")
      .setLngLat([destination.lng, destination.lat])
      .addTo(map);
  }

  createCrossingMarker()
    .setLngLat([crossing.lng, crossing.lat])
    .addTo(map);
}

/** Add a simple crossing marker with popup. */
export function addCrossingMarker(
  map: mapboxgl.Map,
  crossing: MapPoint,
  name?: string
): void {
  new mapboxgl.Marker({ color: "#00E0A0" })
    .setLngLat([crossing.lng, crossing.lat])
    .addTo(map);

  // SECURITY: setText escapes by construction — never setHTML() with a name.
  new mapboxgl.Popup({ offset: 25, closeButton: false })
    .setLngLat([crossing.lng, crossing.lat])
    .setText(name || "Crossing")
    .addTo(map);
}
