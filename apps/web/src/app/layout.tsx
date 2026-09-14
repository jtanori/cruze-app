import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SafeAreaWrapper } from "@/components/layout/SafeAreaWrapper";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Cruze — Border Crossing Intelligence",
  description:
    "Real-time border-crossing gate intelligence for the US-Mexico corridor.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Cruze",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#081830",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="min-h-dvh bg-background text-ink antialiased">
        <ServiceWorkerRegister />
        <SafeAreaWrapper>
          {children}
        </SafeAreaWrapper>
      </body>
    </html>
  );
}
