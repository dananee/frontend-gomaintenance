"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Wrench, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface MaintenanceVehicle {
  id: string;
  name: string;
  service_type: string;
  urgency: "upcoming" | "soon" | "overdue";
  due_in?: string; // "2 days", "Overdue by 5 days"
}

interface VehiclesNeedingMaintenanceProps {
  data: MaintenanceVehicle[];
}

function VehiclesNeedingMaintenanceComponent({
  data = [],
}: VehiclesNeedingMaintenanceProps) {
  const t = useTranslations("features.dashboard.upcomingMaintenance");
  const tUrgency = useTranslations("features.dashboard.urgency");

  const overdueCount = data.filter((v) => v.urgency === "overdue").length;
  const soonCount = data.filter((v) => v.urgency === "soon").length;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-xl font-semibold">
              {t("title")}
            </CardTitle>
          </div>
          {(overdueCount > 0 || soonCount > 0) && (
            <div className="flex gap-2">
              {overdueCount > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {t.rich("overdueBadge", { count: () => <AnimatedNumber value={overdueCount} decimals={0} /> })}
                </span>
              )}
              {soonCount > 0 && (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  {t.rich("soonBadge", { count: () => <AnimatedNumber value={soonCount} decimals={0} /> })}
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {t("empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 5).map((item) => {
              let statusColor = "bg-gray-100 text-gray-700";
              if (item.urgency === "overdue")
                statusColor =
                  "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
              if (item.urgency === "soon")
                statusColor =
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
              if (item.urgency === "upcoming")
                statusColor =
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${statusColor}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.service_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs font-bold ${statusColor}`}
                    >
                      {tUrgency(item.urgency)}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">
                      {t("due", { date: item.due_in || "Unknown" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const VehiclesNeedingMaintenance = memo(
  VehiclesNeedingMaintenanceComponent
);
