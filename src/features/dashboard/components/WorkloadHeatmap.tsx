"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface WorkloadData {
  technician: string;
  months: { month: string; workload: number }[];
}

interface WorkloadHeatmapProps {
  data: WorkloadData[];
}

function WorkloadHeatmapComponent({ data }: WorkloadHeatmapProps) {
  const t = useTranslations("features.dashboard.workload");
  
  const maxWorkload = useMemo(
    () => Math.max(...data.flatMap((tech) => tech.months.map((m) => m.workload))),
    [data]
  );

  const getColor = (workload: number) => {
    const intensity = (workload / maxWorkload) * 100;
    if (intensity < 20)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (intensity < 40)
      return "bg-green-200 text-green-900 dark:bg-green-800/40 dark:text-green-300";
    if (intensity < 60)
      return "bg-yellow-200 text-yellow-900 dark:bg-yellow-800/40 dark:text-yellow-300";
    if (intensity < 80)
      return "bg-orange-300 text-orange-900 dark:bg-orange-700/50 dark:text-orange-300";
    return "bg-red-400 text-red-950 dark:bg-red-700/60 dark:text-red-200";
  };

  const months = data[0]?.months.map((m) => m.month) || [];

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <CardTitle className="text-xl font-semibold">
            {t("title")}
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t("subtitle")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header */}
            <div className="flex gap-2 mb-2">
              <div className="w-32 flex-shrink-0" />
              {months.map((month) => (
                <div
                  key={month}
                  className="w-16 flex-shrink-0 text-center text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="space-y-2">
              {data.map((tech) => (
                <div key={tech.technician} className="flex gap-2 items-center">
                  <div className="w-32 flex-shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {tech.technician}
                  </div>
                  {tech.months.map((month) => (
                    <div
                      key={`${tech.technician}-${month.month}`}
                      className={`w-16 h-12 flex-shrink-0 rounded-lg ${getColor(
                        month.workload
                      )} flex items-center justify-center text-sm font-bold transition-all duration-150 hover:scale-110 hover:shadow-lg cursor-pointer`}
                      style={{ willChange: "transform" }}
                      title={`${tech.technician} - ${month.month}: ${month.workload} WOs`}
                    >
                      {month.workload}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-3 text-xs">
          <span className="text-gray-600 dark:text-gray-400">{t("legend")}</span>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/30" />
            <span className="text-gray-600 dark:text-gray-400">{t("levels.low")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-yellow-200 dark:bg-yellow-800/40" />
            <span className="text-gray-600 dark:text-gray-400">{t("levels.medium")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-orange-300 dark:bg-orange-700/50" />
            <span className="text-gray-600 dark:text-gray-400">{t("levels.high")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-red-400 dark:bg-red-700/60" />
            <span className="text-gray-600 dark:text-gray-400">{t("levels.critical")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const WorkloadHeatmap = memo(WorkloadHeatmapComponent);
