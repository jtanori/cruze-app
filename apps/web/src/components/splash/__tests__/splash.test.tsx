import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SplashScene } from "../SplashScene";
import { SplashGate } from "../SplashGate";
import enMessages from "@/i18n/messages/en.json";

function renderSplash(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("SplashScene (S00)", () => {
  it("renders brand, tagline, and quiet progress — no app controls", () => {
    const { container } = renderSplash(<SplashScene />);
    expect(screen.getByAltText("Cruze — Border Intelligence")).toBeTruthy();
    const text = container.textContent ?? "";
    expect(text).toContain("Smarter crossings.");
    expect(text).toContain("Better journeys.");
    expect(screen.getByRole("status", { name: "Loading CRUZE" })).toBeTruthy();
    expect(container.querySelector("button, a, input")).toBeNull();
  });

  it("is full-bleed with no card treatment", () => {
    const { container } = renderSplash(<SplashScene />);
    const scene = container.querySelector('[data-testid="splash-scene"]');
    expect(scene?.className).toContain("fixed");
    expect(scene?.className).toContain("inset-0");
    expect(scene?.className).not.toMatch(/rounded|border|shadow/);
  });
});

describe("SplashGate (W0 entry)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows splash first, then reveals children once per load", () => {
    const { queryByText, getByText } = renderSplash(
      <SplashGate>
        <p>app content</p>
      </SplashGate>
    );
    expect(document.body.textContent ?? "").toContain("Smarter crossings.");
    expect(queryByText("app content")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(document.body.textContent ?? "").not.toContain("Smarter crossings.");
    expect(getByText("app content")).toBeTruthy();
  });
});
