"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFoundPage");

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
