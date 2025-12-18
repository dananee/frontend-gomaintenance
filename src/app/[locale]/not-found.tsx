"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  // Use a try-catch or a check to handle cases where this might be rendered outside of NextIntlClientProvider
  let t;
  try {
    t = useTranslations("notFoundPage");
  } catch (e) {
    // Fallback for cases where translations aren't available
    t = (key: string) => {
      const messages: Record<string, string> = {
        title: "404 - Page Not Found",
        description: "The page you are looking for does not exist.",
        "actions.backToDashboard": "Back to Dashboard",
        "actions.viewWorkOrders": "View Work Orders",
      };
      return messages[key] || key;
    };
  }

  return (
    <Suspense>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("actions.backToDashboard")}
          </Link>
          <Link
            href="/dashboard/work-orders"
            className={cn(buttonVariants({ variant: "primary" }))}
          >
            {t("actions.viewWorkOrders")}
          </Link>
        </div>
      </div>
    </Suspense>
  );
}
