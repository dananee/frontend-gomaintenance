"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { MonthlyTrendData } from "../types/dashboardKPI.types";
import { useTranslations } from "next-intl";

interface CostTrendChartProps {
  data: MonthlyTrendData[];
}

function CostTrendChartComponent({ data }: CostTrendChartProps) {
  const t = useTranslations("features.dashboard.costTrend");

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value)),
    [data]
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              {t("title")}
            </CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">{t("subtitle")}</span>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 || maxValue <= 0 ? (
          <div className="flex h-[240px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed text-muted-foreground">
            <TrendingUp className="h-8 w-8 opacity-20" />
            <p className="text-sm font-medium">Aucune donnée de coût disponible</p>
            <p className="text-xs">Les tendances apparaîtront après vos premières dépenses.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex h-[240px] items-end justify-between gap-2">
              {data.map((item, index) => {
                const height = (item.value / maxValue) * 100;
                const isRecent = index >= data.length - 3;

                return (
                  <div
                    key={item.month}
                    className="group flex flex-1 flex-col items-center gap-1"
                  >
                    <div className="relative w-full">
                      <div
                        className={`w-full rounded-t-md transition-all duration-150 group-hover:opacity-80 ${
                          isRecent
                            ? "bg-gradient-to-t from-blue-500 to-blue-400"
                            : "bg-gradient-to-t from-gray-400 to-gray-300"
                        }`}
                        style={{ height: `${height}%`, willChange: "opacity" }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          ${item.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const CostTrendChart = memo(CostTrendChartComponent);
