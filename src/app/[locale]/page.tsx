"use client";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("homePage");

  // Middleware handles redirects:
  // - Authenticated users -> /dashboard
  // - Unauthenticated users -> /login
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{t("redirecting")}</h1>
      </div>
    </div>
  );
}
