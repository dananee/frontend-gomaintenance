"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FaultType {
  type: string;
  count: number;
  color: string;
}

interface TopFaultTypesChartProps {
  data: FaultType[];
}

function TopFaultTypesChartComponent({ data }: TopFaultTypesChartProps) {
  const t = useTranslations("features.dashboard.topFaults");

  const maxCount = useMemo(
    () => Math.max(...data.map((d) => d.count)),
    [data]
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-xl font-semibold">
            {t("title")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 || maxCount <= 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed text-muted-foreground">
            <AlertCircle className="h-8 w-8 opacity-20" />
            <p className="text-sm font-medium">Aucun défaut signalé</p>
            <p className="text-xs">Les types de défauts apparaîtront ici.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((fault, index) => {
              const percentage = (fault.count / maxCount) * 100;

              return (
                <div key={fault.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium capitalize">{fault.type}</span>
                    </div>
                    <span className="text-sm font-bold">{fault.count}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-150 hover:opacity-80"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: fault.color,
                        willChange: "opacity",
                      }}
                    />
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

export const TopFaultTypesChart = memo(TopFaultTypesChartComponent);
