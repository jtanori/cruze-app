import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchDirectionsRoute,
  drawRouteLayers,
  fitJourneyBounds,
  addJourneyMarkers,
  addCrossingMarker,
  type MapPoint,
} from "../map-route";

// Mock mapbox-gl
const mockMarkerInstance = {
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
};

const mockMapInstance = {
  addSource: vi.fn(),
  addLayer: vi.fn(),
  fitBounds: vi.fn(),
  jumpTo: vi.fn(),
};

class MockMarker {
  setLngLat() { return this; }
  addTo() { return this; }
}

class MockPopup {
  setLngLat() { return this; }
  addTo() { return this; }
  setHTML() { return this; }
}

vi.mock("mapbox-gl", () => {
  return {
    default: {
      Map: vi.fn().mockImplementation(() => mockMapInstance),
      Marker: MockMarker,
      Popup: MockPopup,
      LngLatBounds: vi.fn().mockImplementation(() => ({
        extend: vi.fn(),
      })),
      supported: vi.fn(() => true),
    },
  };
});

describe("map-route primitives", () => {
  const crossing: MapPoint = { lat: 32.5, lng: -117.0, label: "Lukeville" };
  const origin: MapPoint = { lat: 31.0, lng: -115.5, label: "Mexicali" };
  const destination: MapPoint = { lat: 33.0, lng: -117.5, label: "Calexico" };

  describe("fetchDirectionsRoute", () => {
    beforeEach(() => {
      vi.spyOn(global, "fetch");
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("returns route coordinates on success", async () => {
      const coords = [
        [-115.5, 31.0],
        [-116.0, 31.5],
        [-117.0, 32.5],
      ];
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({ routes: [{ geometry: { coordinates: coords } }] }),
      } as Response);

      const result = await fetchDirectionsRoute(
        [-115.5, 31.0],
        [-117.0, 32.5],
        "test-token"
      );
      expect(result).toEqual(coords);
    });

    it("returns fallback [start, end] when no routes", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({ routes: [] }),
      } as Response);

      const start: [number, number] = [-115.5, 31.0];
      const end: [number, number] = [-117.0, 32.5];
      const result = await fetchDirectionsRoute(start, end, "test-token");
      expect(result).toEqual([start, end]);
    });
  });

  describe("drawRouteLayers", () => {
    it("adds source and two layers to the map", () => {
      const map = {
        addSource: vi.fn(),
        addLayer: vi.fn(),
      } as any;
      const coords: [number, number][] = [
        [-115.5, 31.0],
        [-117.0, 32.5],
      ];

      drawRouteLayers(map, coords);

      expect(map.addSource).toHaveBeenCalledWith(
        "cruze-route",
        expect.objectContaining({ type: "geojson" })
      );
      expect(map.addLayer).toHaveBeenCalledTimes(2);
      expect(map.addLayer.mock.calls[0][0].id).toBe("cruze-route-glow");
      expect(map.addLayer.mock.calls[1][0].id).toBe("cruze-route-line");
    });
  });

  describe("fitJourneyBounds", () => {
    it("calls fitBounds with padding and maxZoom", () => {
      const bounds = { extend: vi.fn() };
      const map = {
        fitBounds: vi.fn(),
      } as any;
      const LngLatBounds = vi.fn(() => bounds);
      vi.doMock("mapbox-gl", () => ({
        default: { LngLatBounds },
      }));

      fitJourneyBounds(map, origin, crossing, destination);

      expect(map.fitBounds).toHaveBeenCalledWith(
        expect.anything(),
        { padding: 50, maxZoom: 12 }
      );
    });
  });

  describe("addJourneyMarkers", () => {
    it("creates 3 markers (origin, destination, crossing)", () => {
      const mapboxgl = require("mapbox-gl");
      const map = {} as any;

      addJourneyMarkers(map, origin, crossing, destination);

      // 3 from addJourneyMarkers + previous calls cleared by beforeEach
      expect(mapboxgl.Marker).toHaveBeenCalledTimes(3);
    });
  });

  describe("addCrossingMarker", () => {
    it("creates marker + popup", () => {
      const mapboxgl = require("mapbox-gl");
      const map = {} as any;

      addCrossingMarker(map, crossing, "Lukeville");

      expect(mapboxgl.Marker).toHaveBeenCalledTimes(1);
      expect(mapboxgl.Popup).toHaveBeenCalledTimes(1);
    });
  });
});
