import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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

describe("DestinationSearch border-relevant rows", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          places: [
            {
              id: "sonoyta",
              name: "Sonoyta",
              formattedAddress: "Sonoyta, Sonora, Mexico",
              latitude: 31.861,
              longitude: -112.85,
              country: "MX",
              countryCode: "MX",
            },
          ],
        }),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows same-country border-relevant places with a nearby-crossing line", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          places: [
            {
              id: "sonoyta",
              name: "Sonoyta",
              formattedAddress: "Sonoyta, Sonora, Mexico",
              latitude: 31.861,
              longitude: -112.85,
              country: "MX",
              countryCode: "MX",
            },
          ],
        }),
      }))
    );
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DestinationSearch
          userLat={32.5}
          userLng={-117}
          userCountry="MX"
          onSelect={() => {}}
        />
      </NextIntlClientProvider>
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "sono" },
    });
    await waitFor(() => expect(screen.getByText("Sonoyta")).toBeTruthy());
    expect(screen.getByText(/Nearby crossing/)).toBeTruthy();
  });
});

describe("DestinationSearch abort + dedup", () => {
  it("keeps the input editable while loading", async () => {
    let resolveFetch!: (v: unknown) => void;
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    vi.stubGlobal("fetch", fetchMock);
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DestinationSearch
          userLat={32.5}
          userLng={-117}
          userCountry="MX"
          onSelect={() => {}}
        />
      </NextIntlClientProvider>
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "san" } });
    // Debounce fires at 300ms; input must never lock meanwhile.
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(input).toBeEnabled();
    await act(async () => {
      resolveFetch({ ok: true, json: async () => ({ places: [] }) });
    });
    expect(input).toBeEnabled();
  });

  it("aborts the stale request; last keystroke wins", async () => {
    const signals: AbortSignal[] = [];
    const resolvers: Array<(v: unknown) => void> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn((url: unknown, init?: RequestInit) => {
        signals.push(init?.signal as AbortSignal);
        return new Promise((resolve) => {
          resolvers.push(resolve);
        });
      })
    );
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DestinationSearch
          userLat={32.5}
          userLng={-117}
          userCountry="MX"
          onSelect={() => {}}
        />
      </NextIntlClientProvider>
    );
    const input = screen.getByRole("textbox");
    const place = (name: string) => ({
      id: name,
      name,
      formattedAddress: `${name}, USA`,
      latitude: 32.7,
      longitude: -117.16,
      country: "US",
      countryCode: "US",
    });

    fireEvent.change(input, { target: { value: "san" } });
    await waitFor(() => expect(signals).toHaveLength(1));
    fireEvent.change(input, { target: { value: "sant" } });
    await waitFor(() => expect(signals).toHaveLength(2));
    expect(signals[0].aborted).toBe(true);

    // Stale resolves first — must be ignored.
    await act(async () => {
      resolvers[0]({ ok: true, json: async () => ({ places: [place("Santa Fe")] }) });
    });
    // Fresh resolves — applied.
    await act(async () => {
      resolvers[1]({ ok: true, json: async () => ({ places: [place("Santee")] }) });
    });
    await waitFor(() => expect(screen.getByText("Santee")).toBeTruthy());
    expect(screen.queryByText("Santa Fe")).toBeNull();
  });

  it("does not refetch an identical query with visible results", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        places: [
          {
            id: "a",
            name: "Alabama",
            formattedAddress: "Alabama, USA",
            latitude: 32.7,
            longitude: -86.9,
            country: "US",
            countryCode: "US",
          },
        ],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DestinationSearch
          userLat={32.5}
          userLng={-117}
          userCountry="MX"
          onSelect={() => {}}
        />
      </NextIntlClientProvider>
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "al" } });
    await waitFor(() => expect(screen.getByText("Alabama")).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fireEvent.change(input, { target: { value: "al" } });
    await new Promise((r) => setTimeout(r, 450));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

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
