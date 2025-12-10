"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getMaintenanceCosts } from "@/features/reports/api/reports";
import { formatCurrency } from "@/lib/formatters";
import { useTranslations } from "next-intl";

export function CostChart() {
  const t = useTranslations("features.reports.cost");
  const { data, isLoading } = useQuery({
    queryKey: ["maintenance-costs"],
    queryFn: () => {
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 6);

      return getMaintenanceCosts({
        from: fromDate.toISOString().split("T")[0],
        to: toDate.toISOString().split("T")[0],
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("loading")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("total")}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(data?.total_cost || 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("labor")}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data?.labor_cost || 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("parts")}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(data?.parts_cost || 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("external")}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(data?.external_service_cost || 0)}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("workOrders")}: <span className="font-semibold">{data?.work_order_count || 0}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
