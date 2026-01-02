import type { Metadata } from "next";
import { Inter } from "next/font/google"; // or local font
import { Suspense } from "react";
import "../globals.css";
import { Providers } from "../providers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalErrorBoundary } from "@/components/layout/GlobalErrorBoundary";
import { OfflineIndicatorClient } from "@/features/offline/components/OfflineIndicatorClient";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { BrandingProvider } from "@/features/settings/providers/BrandingProvider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import GoogleAnalyticsComponent from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";
import { initSentry } from "@/lib/analytics/sentry";

// Initialize Sentry outside component to run once
if (typeof window !== "undefined") {
  initSentry();
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fleet Maintenance System",
  description: "Manage your fleet efficiently",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";
  const clarityId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID || "";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <GlobalErrorBoundary>
          {googleAnalyticsId && <GoogleAnalyticsComponent gaId={googleAnalyticsId} />}
          {clarityId && <MicrosoftClarity clarityId={clarityId} />}
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <BrandingProvider>
                <Suspense fallback={null}>
                  <ProgressBar />
                </Suspense>
                <OfflineIndicatorClient />
                {children}
                <Toaster />
              </BrandingProvider>
            </Providers>
          </NextIntlClientProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
