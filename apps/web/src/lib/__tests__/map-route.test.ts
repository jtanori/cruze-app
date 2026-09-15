import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import mapboxgl from "mapbox-gl";
import {
  fetchDirectionsRoute,
  drawRouteLayers,
  fitJourneyBounds,
  addJourneyMarkers,
  addCrossingMarker,
  createLabeledMarker,
  type MapPoint,
} from "../map-route";

// Mock mapbox-gl (classes defined inside the hoisted factory).
vi.mock("mapbox-gl", () => {
  class MockMarker {
    static instances: MockMarker[] = [];
    element: unknown;
    constructor(opts?: { element?: unknown }) {
      this.element = opts?.element;
      MockMarker.instances.push(this);
    }
    setLngLat() { return this; }
    addTo() { return this; }
  }
  class MockPopup {
    static instances: MockPopup[] = [];
    text: string | undefined;
    constructor() {
      MockPopup.instances.push(this);
    }
    setLngLat() { return this; }
    addTo() { return this; }
    setText(text: string) { this.text = text; return this; }
  }
  return {
    default: {
      Map: vi.fn().mockImplementation(() => ({
        addSource: vi.fn(),
        addLayer: vi.fn(),
        fitBounds: vi.fn(),
        jumpTo: vi.fn(),
      })),
      Marker: MockMarker,
      Popup: MockPopup,
      LngLatBounds: class {
        extend() { return this; }
      },
      supported: vi.fn(() => true),
    },
  };
});

function mockedClasses() {
  // Static import resolves through the same mock registry as the SUT.
  // (Dynamic import() bypasses it and returns the real mapbox-gl.)
  return mapboxgl as unknown as {
    Marker: { instances: Array<{ element?: unknown }> };
    Popup: { instances: Array<{ text?: string }> };
  };
}

function clearMockInstances() {
  const mocked = mockedClasses();
  mocked.Marker.instances.length = 0;
  mocked.Popup.instances.length = 0;
}

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

    it("returns route coordinates on success via same-origin proxy", async () => {
      const coords = [
        [-115.5, 31.0],
        [-116.0, 31.5],
        [-117.0, 32.5],
      ];
      const fetchMock = vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({ coordinates: coords }),
      } as Response);

      const result = await fetchDirectionsRoute(
        [-115.5, 31.0],
        [-117.0, 32.5]
      );
      expect(result).toEqual(coords);
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url.startsWith("/api/directions?")).toBe(true);
      expect(url).not.toContain("access_token");
    });

    it("returns fallback [start, end] when no coordinates", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({}),
      } as Response);

      const start: [number, number] = [-115.5, 31.0];
      const end: [number, number] = [-117.0, 32.5];
      const result = await fetchDirectionsRoute(start, end);
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
      clearMockInstances();
      const map = {} as any;

      addJourneyMarkers(map, origin, crossing, destination);

      expect(mockedClasses().Marker.instances).toHaveLength(3);
    });
  });

  describe("addCrossingMarker", () => {
    it("creates marker + text popup (never HTML)", () => {
      clearMockInstances();
      const map = {} as any;

      addCrossingMarker(map, crossing, "Lukeville<script>alert(1)</script>");

      const mocked = mockedClasses();
      expect(mocked.Marker.instances).toHaveLength(1);
      expect(mocked.Popup.instances).toHaveLength(1);
      // setText path: payload stored as text, never parsed as markup.
      expect(mocked.Popup.instances[0].text).toBe(
        "Lukeville<script>alert(1)</script>"
      );
    });
  });

  describe("createLabeledMarker (XSS)", () => {
    it("renders a hostile label as inert text, not markup", () => {
      const marker = createLabeledMarker(
        '</span><img src=x onerror="window.__xss=1">',
        "#FFFFFF",
        "left"
      ) as unknown as { element: HTMLElement };
      const el = marker.element;
      // No executable nodes may exist in the marker DOM.
      expect(el.querySelector("img")).toBeNull();
      expect(el.querySelector("script")).toBeNull();
      const span = el.querySelector("[data-marker-label]");
      expect(span?.textContent).toContain('<img src=x onerror="window.__xss=1">');
      expect((window as any).__xss).toBeUndefined();
    });

    it("falls back to white for non-hex colors", () => {
      const marker = createLabeledMarker(
        "Tijuana",
        'red";background:url(javascript:alert(1))',
        "left"
      ) as unknown as { element: HTMLElement };
      const el = marker.element;
      expect(el.innerHTML).not.toContain("javascript:");
      expect(el.innerHTML).toContain("#FFFFFF");
    });
  });
});
