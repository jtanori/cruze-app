import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as placesGET } from "../places/route";
import { GET as reverseGET } from "../reverse/route";
import { GET as directionsGET } from "../directions/route";

function req(path: string): NextRequest {
  return new NextRequest(`http://localhost${path}`);
}

function mockMapbox(payload: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: unknown) => {
      const href = String(url);
      if (href.includes("api.mapbox.com")) {
        return { ok, status: ok ? 200 : 500, json: async () => payload };
      }
      throw new Error(`unexpected fetch: ${href}`);
    })
  );
}

describe("GET /api/places", () => {
  beforeEach(() => {
    vi.stubEnv("MAPBOX_TOKEN", "test-token");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns slimmed places without leaking the token or raw features", async () => {
    mockMapbox({
      features: [
        {
          id: "place.1",
          place_name: "Tijuana, Baja California, Mexico",
          center: [-117.0372, 32.5149],
          context: [],
          properties: { short_code: "mx" },
        },
      ],
    });
    const res = await placesGET(req("/api/places?query=tijuana&country=MX&limit=5"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.places).toHaveLength(1);
    expect(body.places[0]).toMatchObject({
      name: "Tijuana",
      latitude: 32.5149,
      country: "MX",
    });
    const raw = JSON.stringify(body);
    expect(raw).not.toContain("test-token");
    expect(raw).not.toContain("properties");
  });

  it("returns [] for short queries without calling Mapbox", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("must not fetch");
    });
    vi.stubGlobal("fetch", fetchMock);
    const res = await placesGET(req("/api/places?query=t"));
    expect(res.status).toBe(200);
    expect((await res.json()).places).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("400s overlong queries", async () => {
    const res = await placesGET(req(`/api/places?query=${"x".repeat(101)}`));
    expect(res.status).toBe(400);
  });

  it("503s without a token", async () => {
    vi.stubEnv("MAPBOX_TOKEN", "");
    delete process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const res = await placesGET(req("/api/places?query=tijuana"));
    expect(res.status).toBe(503);
  });

  it("derives country from Mapbox context, never a bare default", async () => {
    mockMapbox({
      features: [
        {
          id: "place.us",
          place_name: "San Diego, California, United States",
          center: [-117.16, 32.71],
          context: [{ id: "country.123", short_code: "us", text: "United States" }],
        },
      ],
    });
    const res = await placesGET(req("/api/places?query=san&country=mx%2Cus"));
    const body = await res.json();
    expect(body.places[0].country).toBe("US");
  });

  it("drops non-mainland US regions (Alaska, Hawaii, territories)", async () => {
    mockMapbox({
      features: [
        {
          id: "place.ak",
          place_name: "Alaska, United States",
          center: [-152, 64],
          context: [
            { id: "region.1", short_code: "US-AK", text: "Alaska" },
            { id: "country.1", short_code: "us", text: "United States" },
          ],
        },
        {
          id: "place.sy",
          place_name: "San Ysidro, California, United States",
          center: [-117.03, 32.54],
          context: [
            { id: "region.2", short_code: "US-CA", text: "California" },
            { id: "country.1", short_code: "us", text: "United States" },
          ],
        },
      ],
    });
    const res = await placesGET(req("/api/places?query=al&country=us"));
    const body = await res.json();
    expect(body.places.map((p: { id: string }) => p.id)).toEqual(["place.sy"]);
  });

  it("drops country-indeterminable results instead of mislabeling", async () => {
    mockMapbox({
      features: [
        {
          id: "place.mystery",
          place_name: "Somewhere",
          center: [0, 0],
          context: [],
        },
      ],
    });
    const res = await placesGET(req("/api/places?query=some&country=mx%2Cus"));
    expect((await res.json()).places).toEqual([]);
  });
});

describe("GET /api/reverse", () => {
  beforeEach(() => {
    vi.stubEnv("MAPBOX_TOKEN", "test-token");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns a place for valid coordinates", async () => {
    mockMapbox({
      features: [
        {
          id: "place.2",
          place_name: "San Diego, California, USA",
          center: [-117.1611, 32.7157],
          context: [],
          properties: { short_code: "us" },
        },
      ],
    });
    const res = await reverseGET(req("/api/reverse?lat=32.7157&lng=-117.1611"));
    expect(res.status).toBe(200);
    expect((await res.json()).place).toMatchObject({ country: "US" });
  });

  it("400s missing or invalid coordinates", async () => {
    expect((await reverseGET(req("/api/reverse?lat=32.7"))).status).toBe(400);
    expect((await reverseGET(req("/api/reverse?lat=999&lng=-117"))).status).toBe(400);
    expect((await reverseGET(req("/api/reverse?lat=abc&lng=-117"))).status).toBe(400);
  });
});

describe("GET /api/directions", () => {
  beforeEach(() => {
    vi.stubEnv("MAPBOX_TOKEN", "test-token");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns coordinates only, no metadata", async () => {
    mockMapbox({
      routes: [{ geometry: { coordinates: [[-117, 32.5]] }, duration: 99, legs: [{}] }],
    });
    const res = await directionsGET(
      req("/api/directions?start=-117,32.5&end=-117.16,32.71")
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.coordinates).toEqual([[-117, 32.5]]);
    expect(body.duration).toBeUndefined();
  });

  it("400s malformed pairs", async () => {
    expect((await directionsGET(req("/api/directions?start=nope&end=-117,32"))).status).toBe(400);
    expect((await directionsGET(req("/api/directions?start=-117,32"))).status).toBe(400);
  });

  it("falls back to endpoints when Mapbox has no route", async () => {
    mockMapbox({ routes: [] });
    const res = await directionsGET(
      req("/api/directions?start=-117,32.5&end=-117.16,32.71")
    );
    expect((await res.json()).coordinates).toEqual([
      [-117, 32.5],
      [-117.16, 32.71],
    ]);
  });
});
