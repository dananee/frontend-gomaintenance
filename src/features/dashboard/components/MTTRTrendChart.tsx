"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface MTTRTrendData {
  month: string;
  mttr: number; // hours
}

interface MTTRTrendChartProps {
  data: MTTRTrendData[];
}

function MTTRTrendChartComponent({ data }: MTTRTrendChartProps) {
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.mttr)),
    [data]
  );
  const avgMTTR = useMemo(
    () => (data.reduce((sum, d) => sum + d.mttr, 0) / data.length).toFixed(1),
    [data]
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <CardTitle className="text-xl font-semibold">
              MTTR Trend (12 Months)
            </CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {avgMTTR}h
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Average</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = (item.mttr / maxValue) * 100;
            const isImproving = index > 0 && item.mttr < data[index - 1].mttr;

            return (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {item.month}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {item.mttr.toFixed(1)}h
                    </span>
                    {isImproving && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        ↓
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${percentage}%`, willChange: "width" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export const MTTRTrendChart = memo(MTTRTrendChartComponent);
