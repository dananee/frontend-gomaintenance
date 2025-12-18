"use client";

import { OdooIntegrationCard } from "@/features/settings/components/OdooIntegrationCard";
import { useTranslations } from "next-intl";

export default function IntegrationsPage() {
  const t = useTranslations("settings.integrations");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Only Odoo supported now as per new requirement */}
        <OdooIntegrationCard />
      </div>
    </div>
  );
}
