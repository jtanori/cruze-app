import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { TripSetupFlow } from "../TripSetupFlow";
import { useTripStore } from "@/stores/trip";
import enMessages from "@/i18n/messages/en.json";

const backMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, back: backMock }),
  useSearchParams: () => new URLSearchParams(""),
  usePathname: () => "/es/trip/setup",
}));

vi.mock("@/components/location/LocationProvider", () => ({
  useLocationContext: () => ({ location: null }),
}));

function renderFlow() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <TripSetupFlow />
    </NextIntlClientProvider>
  );
}

describe("TripSetupFlow back behavior", () => {
  beforeEach(() => {
    backMock.mockClear();
    pushMock.mockClear();
    useTripStore.getState().reset();
  });

  it("back at the entry step exits via history instead of rewinding", () => {
    renderFlow();
    // No handoff: entry step is destination.
    fireEvent.click(screen.getByLabelText("Back"));
    expect(backMock).toHaveBeenCalledTimes(1);
    expect(pushMock).not.toHaveBeenCalled();
  });
});
