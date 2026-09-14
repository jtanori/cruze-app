import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { CrossingsDirectoryRow } from "../CrossingsDirectoryRow";
import { TripNearbyCrossingRow } from "../../trip/TripNearbyCrossingRow";
import enMessages from "@/i18n/messages/en.json";

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

/**
 * Direction indicators must read as travel pairs (MX → US), never bare
 * compass words that confuse place with direction.
 */
describe("direction labels (option B)", () => {
  it("directory row shows country pairs", () => {
    const { container } = renderWithIntl(
      <CrossingsDirectoryRow
        crossingName="San Ysidro"
        status="operational"
        northboundWait={30}
        southboundWait={20}
      />
    );
    const text = container.textContent ?? "";
    expect(text).toContain("MX → US");
    expect(text).toContain("US → MX");
    expect(text).not.toMatch(/Norte|Sur/);
  });

  it("nearby row shows the travel pair per direction", () => {
    const mx = renderWithIntl(
      <TripNearbyCrossingRow
        name="San Ysidro"
        waitTime={30}
        direction="MX_TO_US"
        status="open"
        lastUpdated={Date.now()}
        onClick={() => {}}
      />
    );
    expect(mx.container.textContent ?? "").toContain("MX → US");

    const us = renderWithIntl(
      <TripNearbyCrossingRow
        name="San Ysidro"
        waitTime={30}
        direction="US_TO_MX"
        status="open"
        lastUpdated={Date.now()}
        onClick={() => {}}
      />
    );
    expect(us.container.textContent ?? "").toContain("US → MX");
    mx.unmount();
    us.unmount();
  });
});
