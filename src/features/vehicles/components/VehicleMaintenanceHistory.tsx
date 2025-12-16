"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, DollarSign } from "lucide-react";
import { formatDateShort, formatCurrency } from "@/lib/formatters";
import { useTranslations } from "next-intl";

interface MaintenanceRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  mileage: number;
  cost?: number;
  status: "completed" | "cancelled";
  technician?: string;
}

interface VehicleMaintenanceHistoryProps {
  records?: MaintenanceRecord[];
}

export function VehicleMaintenanceHistory({
  records = [],
}: VehicleMaintenanceHistoryProps) {
  const t = useTranslations("features.vehicles.maintenance");

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t("noHistory")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("historyTitle")}
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-6">
          {records.map((record) => (
            <div key={record.id} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-3 top-2 h-4 w-4 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-900" />

              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {record.type}
                        </h4>
                        <Badge
                          variant={
                            record.status === "completed" ? "success" : "outline"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {record.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDateShort(record.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wrench className="h-3.5 w-3.5" />
                          <span>{record.mileage.toLocaleString()} km</span>
                        </div>
                        {record.cost && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>{formatCurrency(record.cost)}</span>
                          </div>
                        )}
                      </div>

                      {record.technician && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {t("technician")}: {record.technician}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
