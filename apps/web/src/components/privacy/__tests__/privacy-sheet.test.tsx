import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { PrivacySheet } from "../PrivacySheet";
import { CookieNotice } from "../CookieNotice";
import { usePrivacyStore } from "@/stores/privacy";
import enMessages from "@/i18n/messages/en.json";

vi.mock("@/components/location/LocationProvider", () => ({
  useLocationContext: () => ({ location: null }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/es/trip",
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("PrivacySheet", () => {
  beforeEach(() => {
    usePrivacyStore.getState().reset();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ versions: { privacy: { version: "9.9" } } }),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("appears when the version is unacknowledged", async () => {
    renderWithIntl(<PrivacySheet />);
    await waitFor(() =>
      expect(screen.getByText("Your privacy matters")).toBeTruthy()
    );
  });

  it("stays hidden when already acknowledged", async () => {
    usePrivacyStore.getState().acknowledge({
      documentKey: "privacy",
      documentVersion: "9.9",
      locale: "en",
      jurisdiction: "UNKNOWN",
      withOptionals: true,
    });
    const { container } = renderWithIntl(<PrivacySheet />);
    await new Promise((r) => setTimeout(r, 100));
    expect(container.textContent).toBe("");
  });

  it("continue writes a versioned record and closes", async () => {
    renderWithIntl(<PrivacySheet />);
    await waitFor(() =>
      fireEvent.click(screen.getByText("Continue"))
    );
    expect(usePrivacyStore.getState().isAcknowledged("9.9")).toBe(true);
    await waitFor(() =>
      expect(screen.queryByText("Your privacy matters")).toBeNull()
    );
  });
});

describe("CookieNotice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows once and persists dismissal", () => {
    const first = renderWithIntl(<CookieNotice />);
    expect(first.getByText("We store data on your device")).toBeTruthy();
    fireEvent.click(first.getByText("Got it"));
    expect(localStorage.getItem("cruze-cookie-notice-dismissed")).toBe("1");
    first.unmount();

    const second = renderWithIntl(<CookieNotice />);
    expect(second.container.textContent).toBe("");
    second.unmount();
  });
});
