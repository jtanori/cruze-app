import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SafeAreaWrapper } from "@/components/layout/SafeAreaWrapper";

export const metadata: Metadata = {
  title: "Cruze — Border Crossing Intelligence",
  description:
    "Real-time border-crossing gate intelligence for the US-Mexico corridor.",
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
        <SafeAreaWrapper>
          {children}
        </SafeAreaWrapper>
      </body>
    </html>
  );
}
