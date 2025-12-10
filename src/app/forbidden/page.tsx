"use client";

import { ShieldX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ForbiddenPage() {
  const t = useTranslations("forbidden");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900/40">
          <ShieldX className="h-10 w-10 text-amber-600 dark:text-amber-300" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("error")}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("title")}</h1>
          <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/login">{t("actions.switchAccount")}</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">{t("actions.backToDashboard")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
