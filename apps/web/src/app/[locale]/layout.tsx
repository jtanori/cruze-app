import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LangSetter } from "@/components/shared/LangSetter";
import { LocationProvider } from "@/components/location/LocationProvider";
import { SplashGate } from "@/components/splash/SplashGate";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LangSetter locale={locale} />
      <LocationProvider>
        <SplashGate>{children}</SplashGate>
      </LocationProvider>
    </NextIntlClientProvider>
  );
}
