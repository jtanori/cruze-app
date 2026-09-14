import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { DestinationSearch } from "../DestinationSearch";
import enMessages from "@/i18n/messages/en.json";

function mockPlacesFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        places: [
          {
            id: "p1",
            name: "Alabama",
            formattedAddress: "Alabama, United States",
            latitude: 32.7,
            longitude: -86.9,
            country: "US",
            countryCode: "US",
          },
        ],
      }),
    }))
  );
}

function renderSearch() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <DestinationSearch
        userLat={32.5}
        userLng={-117}
        userCountry="MX"
        onSelect={() => {}}
      />
    </NextIntlClientProvider>
  );
}

describe("DestinationSearch dropdown visibility", () => {
  beforeEach(() => {
    mockPlacesFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hides the dropdown on blur outside the results", async () => {
    renderSearch();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "al" } });

    await waitFor(() => expect(screen.getByText("Alabama")).toBeTruthy());

    fireEvent.blur(input);
    await waitFor(() =>
      expect(screen.queryByText("Alabama")).toBeNull()
    );
  });

  it("shows a badge on blur with results, dropdown returns on focus", async () => {
    renderSearch();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "al" } });

    await waitFor(() => expect(screen.getByText("Alabama")).toBeTruthy());

    fireEvent.blur(input);
    await waitFor(() =>
      expect(screen.queryByText("Alabama")).toBeNull()
    );
    // Badge appears with the result count.
    expect(screen.getByText(/1 result/)).toBeTruthy();

    // Focus restores the dropdown and hides the badge.
    fireEvent.focus(input);
    await waitFor(() => expect(screen.getByText("Alabama")).toBeTruthy());
    expect(screen.queryByText(/1 result/)).toBeNull();
  });

  it("badge tap reopens the dropdown", async () => {
    renderSearch();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "al" } });

    await waitFor(() => expect(screen.getByText("Alabama")).toBeTruthy());

    fireEvent.blur(input);
    await waitFor(() =>
      expect(screen.getByText(/1 result/)).toBeTruthy()
    );
    fireEvent.click(screen.getByText(/1 result/));
    await waitFor(() => expect(screen.getByText("Alabama")).toBeTruthy());
  });

  it("hides the dropdown when the query is cleared manually", async () => {
    renderSearch();
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "al" } });

    await waitFor(() => expect(screen.getByText("Alabama")).toBeTruthy());

    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() =>
      expect(screen.queryByText("Alabama")).toBeNull()
    );
  });
});
