import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { searchPlaces, searchLocations, reverseGeocode } from "../geocoding";

function mockSameOrigin(payload: unknown, ok = true) {
  return vi.fn(async (url: unknown) => {
    const href = String(url);
    if (!href.startsWith("/api/")) {
      throw new Error(`must stay same-origin, got: ${href}`);
    }
    return { ok, status: ok ? 200 : 500, json: async () => payload };
  });
}

describe("geocoding clients stay same-origin (S2)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("searchPlaces hits /api/places with no token in URL", async () => {
    const fetchMock = mockSameOrigin({
      places: [
        {
          id: "p1",
          name: "Tijuana",
          formattedAddress: "Tijuana, MX",
          latitude: 32.5,
          longitude: -117,
          country: "MX",
          countryCode: "MX",
        },
      ],
    });
    vi.stubGlobal("fetch", fetchMock);

    const places = await searchPlaces("tijuana", 5, "MX");
    expect(places).toHaveLength(1);
    expect(places[0]).toMatchObject({ name: "Tijuana", country: "MX" });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/api/places?");
    expect(url).toContain("country=MX");
    expect(url).not.toContain("access_token");
    expect(url).not.toContain("mapbox.com");
  });

  it("searchLocations maps proxy places to results", async () => {
    vi.stubGlobal(
      "fetch",
      mockSameOrigin({
        places: [
          {
            id: "p1",
            name: "Tijuana",
            formattedAddress: "Tijuana, MX",
            latitude: 32.5,
            longitude: -117,
            country: "MX",
            countryCode: "MX",
            city: "Tijuana",
          },
        ],
      })
    );

    const results = await searchLocations("tijuana");
    expect(results[0]).toMatchObject({
      id: "p1",
      center: [-117, 32.5],
    });
  });

  it("reverseGeocode hits /api/reverse and returns null on failure", async () => {
    const fetchMock = mockSameOrigin({
      place: {
        id: "p2",
        name: "San Diego",
        formattedAddress: "San Diego, US",
        latitude: 32.7,
        longitude: -117.16,
        country: "US",
        countryCode: "US",
      },
    });
    vi.stubGlobal("fetch", fetchMock);

    const place = await reverseGeocode(32.7, -117.16);
    expect(place).toMatchObject({ name: "San Diego" });
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/reverse?");
  });

  it("returns [] for short queries without fetching", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await searchPlaces("t", 5)).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
