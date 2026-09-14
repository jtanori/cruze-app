import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SettingsDataSharing } from "../SettingsDataSharing";
import { useMonetizationStore } from "@/stores/monetization";
import enMessages from "@/i18n/messages/en.json";

function renderSharing() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <SettingsDataSharing />
    </NextIntlClientProvider>
  );
}

describe("SettingsDataSharing", () => {
  beforeEach(() => {
    useMonetizationStore.setState({
      contribution: { enabled: false, signals: [], lastContributedAt: null },
      consentRecords: [],
    });
  });

  it("renders three granular toggles plus policy version", () => {
    renderSharing();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(screen.getByText("Privacy and data")).toBeTruthy();
    expect(screen.getByText("Share trip signals")).toBeTruthy();
    expect(screen.getByText("Personalized ads")).toBeTruthy();
    expect(screen.getByText("Usage analytics")).toBeTruthy();
    expect(screen.getByText(/Consent policy v/)).toBeTruthy();
  });

  it("contribution toggle flips state and records versioned consent", () => {
    renderSharing();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(useMonetizationStore.getState().contribution.enabled).toBe(true);
    expect(useMonetizationStore.getState().hasConsent("data_contribution")).toBe(true);
    const records = useMonetizationStore.getState().consentRecords;
    expect(records[records.length - 1].version).toBeTruthy();
  });

  it("ads toggle records and revokes consent", () => {
    renderSharing();
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(useMonetizationStore.getState().hasConsent("personalized_ads")).toBe(true);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(useMonetizationStore.getState().hasConsent("personalized_ads")).toBe(false);
  });

  it("stale policy versions read as denied", () => {
    useMonetizationStore.setState({
      consentRecords: [
        {
          type: "analytics",
          granted: true,
          timestamp: new Date().toISOString(),
          version: "2000-01",
        },
      ],
    });
    expect(useMonetizationStore.getState().hasConsent("analytics")).toBe(false);
  });
});
