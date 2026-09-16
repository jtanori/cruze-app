import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Button } from "../Button";
import enMessages from "@/i18n/messages/en.json";

function renderButton(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("Button disabled treatment", () => {
  it("primary disabled goes hollow instead of translucent-filled", () => {
    const { container } = renderButton(<Button disabled>Go</Button>);
    const button = container.querySelector("button")!;
    expect(button.disabled).toBe(true);
    expect(button.className).toContain("disabled:bg-surface-elevated");
    expect(button.className).toContain("disabled:text-faint");
    expect(button.className).not.toContain("disabled:opacity-50");
  });

  it("secondary disabled keeps dimming", () => {
    const { container } = renderButton(
      <Button variant="secondary" disabled>
        Go
      </Button>
    );
    expect(container.querySelector("button")!.className).toContain(
      "disabled:opacity-50"
    );
  });
});
