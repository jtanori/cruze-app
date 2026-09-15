import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { TripSetupOriginStep } from "../TripSetupOriginStep";
import enMessages from "@/i18n/messages/en.json";

const MX_LOCATION = {
  lat: 31.32,
  lng: -113.54,
  accuracy: 12,
  timestamp: Date.now(),
  country: "MX",
  countryConfidence: "HIGH",
  placeName: "Puerto Peñasco",
  city: "Puerto Peñasco",
  region: "Sonora",
};

vi.mock("@/components/location/LocationProvider", () => ({
  useLocationContext: () => ({ location: MX_LOCATION }),
}));

vi.mock("@/lib/geocoding", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/geocoding")>();
  return {
    ...actual,
    reverseGeocode: vi.fn(async () => null),
    searchPlaces: vi.fn(async () => []),
  };
});

function renderStep(onSelect = vi.fn()) {
  render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <TripSetupOriginStep value={null} onSelect={onSelect} />
    </NextIntlClientProvider>
  );
  return onSelect;
}

describe("TripSetupOriginStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preselects known location on mount (spec default origin)", () => {
    const onSelect = renderStep();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "current-location",
        lat: 31.32,
        lng: -113.54,
        country: "MX",
      })
    );
  });

  it("displays the resolved place, not a second GPS action", () => {
    renderStep();
    expect(screen.getByText("Puerto Peñasco")).toBeTruthy();
    expect(screen.queryByText("Usar GPS para origen")).toBeNull();
  });

  it("manual search offers real places, never fabricated coords", async () => {
    const { searchPlaces } = await import("@/lib/geocoding");
    vi.mocked(searchPlaces).mockResolvedValue([
      {
        id: "s1",
        name: "Sonoita",
        formattedAddress: "Sonoita, Sonora, Mexico",
        latitude: 31.861,
        longitude: -112.85,
        country: "MX",
        countryCode: "MX",
      },
    ]);
    const onSelect = renderStep();
    onSelect.mockClear();

    fireEvent.click(screen.getByText("Ingresar punto de partida"));
    fireEvent.change(screen.getByPlaceholderText("Buscar ciudad, dirección..."), {
      target: { value: "sono" },
    });
    await waitFor(() => expect(screen.getByText("Sonoita")).toBeTruthy());
    fireEvent.click(screen.getByText("Sonoita"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "manual-s1",
        name: "Sonoita",
        lat: 31.861,
        lng: -112.85,
        country: "MX",
      })
    );
  });
});
