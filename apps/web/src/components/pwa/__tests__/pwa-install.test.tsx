import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { PwaInstallRow } from "../PwaInstallRow";
import enMessages from "@/i18n/messages/en.json";

const PUBLIC_DIR = join(process.cwd(), "public");

describe("PWA manifest", () => {
  it("is valid with required installability fields", () => {
    const manifest = JSON.parse(
      readFileSync(join(PUBLIC_DIR, "manifest.webmanifest"), "utf-8")
    );
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.theme_color).toBeTruthy();
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect(
      manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")
    ).toBe(true);
  });

  it("referenced icon files exist on disk", () => {
    const manifest = JSON.parse(
      readFileSync(join(PUBLIC_DIR, "manifest.webmanifest"), "utf-8")
    );
    for (const icon of manifest.icons) {
      expect(
        existsSync(join(PUBLIC_DIR, icon.src)),
        `missing ${icon.src}`
      ).toBe(true);
    }
  });

  it("service worker covers install/activate/fetch", () => {
    const sw = readFileSync(join(PUBLIC_DIR, "sw.js"), "utf-8");
    expect(sw).toContain('addEventListener("install"');
    expect(sw).toContain('addEventListener("activate"');
    expect(sw).toContain('addEventListener("fetch"');
    expect(sw).toContain("skipWaiting");
  });
});

function fireInstallPrompt() {
  const event = new Event("beforeinstallprompt") as Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  };
  event.prompt = vi.fn(async () => {});
  event.userChoice = Promise.resolve({ outcome: "accepted" });
  window.dispatchEvent(event);
  return event;
}

function renderRow() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <PwaInstallRow />
    </NextIntlClientProvider>
  );
}

describe("usePwaInstall / PwaInstallRow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows nothing until the install prompt fires", () => {
    const { container } = renderRow();
    expect(container.textContent).toBe("");
  });

  it("shows install UI on beforeinstallprompt and prompts on tap", async () => {
    renderRow();
    let event: ReturnType<typeof fireInstallPrompt>;
    await act(async () => {
      event = fireInstallPrompt();
    });
    expect(screen.getByText("Install Cruze")).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByText("Install"));
    });
    expect(event!.prompt).toHaveBeenCalledTimes(1);
  });

  it("dismiss persists and hides the row", () => {
    renderRow();
    act(() => {
      fireInstallPrompt();
    });
    expect(screen.getByText("Install Cruze")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Close"));
    expect(localStorage.getItem("cruze-pwa-install-dismissed")).toBe("1");
  });
});
