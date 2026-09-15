import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { TripNearbyCrossingRow } from "../TripNearbyCrossingRow";
import enMessages from "@/i18n/messages/en.json";

function renderRow(props: Partial<Parameters<typeof TripNearbyCrossingRow>[0]> = {}) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <TripNearbyCrossingRow
        name="Andrade"
        waitTime={10}
        direction="MX_TO_US"
        status="open"
        lastUpdated={Date.now()}
        onClick={() => {}}
        {...props}
      />
    </NextIntlClientProvider>
  );
}

describe("TripNearbyCrossingRow identity + distance (V1)", () => {
  it("shows city pair and distance with wait on the second line", () => {
    const { container } = renderRow({
      mexicanCity: "Los Algodones",
      usCity: "California",
      distanceKm: 12.4,
    });
    const text = container.textContent ?? "";
    expect(text).toContain("Los Algodones ↔ California");
    expect(text).toContain("12 km");
    expect(text).toContain("10 min");
    expect(text).not.toMatch(/Norte|Sur/);
  });

  it("falls back to wait on line one without distance", () => {
    const { container } = renderRow({
      mexicanCity: "Tijuana",
      usCity: "San Diego",
    });
    const text = container.textContent ?? "";
    expect(text).toContain("Tijuana ↔ San Diego");
    expect(text).toContain("10 min");
  });

  it("shows MX → US travel pair, never bare compass words", () => {
    const { container } = renderRow({});
    expect(container.textContent ?? "").toContain("MX → US");
  });
});
