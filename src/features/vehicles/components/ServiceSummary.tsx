"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, User, Wrench } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface ServiceSummaryProps {
  lastMaintenanceDate: string;
  lastMaintenanceCost: number;
  nextServiceDue: string;
  lastTechnician: string;
  serviceInterval: string;
}

export function ServiceSummary({
  lastMaintenanceDate,
  lastMaintenanceCost,
  nextServiceDue,
  lastTechnician,
  serviceInterval,
}: ServiceSummaryProps) {
  const t = useTranslations("vehicles.details.kpis.serviceSummary");
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',

    };

    return date.toLocaleDateString('fr-FR', options);
  };
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">
            {t("title")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                {t("lastMaintenance")}
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <p className="font-medium">{lastMaintenanceDate}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                {t("lastCost")}
              </p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="font-medium">
                  <AnimatedNumber value={lastMaintenanceCost} currency="MAD" />
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                {t("lastTechnician")}
              </p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                <p className="font-medium">{lastTechnician}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:border-blue-900/50 dark:from-blue-900/20 dark:to-transparent">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/80 dark:text-blue-400 mb-2">
                {t("nextServiceDue")}
              </p>
              <p className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                {formatDate(nextServiceDue)}

              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                {t("serviceInterval")}
              </p>
              <p className="font-medium">{serviceInterval}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
