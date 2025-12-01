"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface CostForecastData {
  month: string;
  actual?: number;
  predicted: number;
  confidence: { lower: number; upper: number };
}

interface CostForecastChartProps {
  data: CostForecastData[];
}

function CostForecastChartComponent({ data }: CostForecastChartProps) {
  const maxValue = useMemo(
    () =>
      Math.max(
        ...data.map((d) => d.actual || d.predicted),
        ...data.map((d) => d.confidence.upper)
      ),
    [data]
  );

  const { forecastMonths, avgForecast } = useMemo(() => {
    const months = data.filter((d) => !d.actual).length;
    const avg = (
      data.filter((d) => !d.actual).reduce((sum, d) => sum + d.predicted, 0) /
      months
    ).toFixed(0);
    return { forecastMonths: months, avgForecast: avg };
  }, [data]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-xl font-semibold">
              Cost Forecast (6 Months)
            </CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${avgForecast}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Avg Predicted
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => {
            const value = item.actual || item.predicted;
            const percentage = (value / maxValue) * 100;
            const isForecast = !item.actual;

            return (
              <div key={item.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.month}
                    </span>
                    {isForecast && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        AI
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    ${value.toLocaleString()}
                  </span>
                </div>

                {/* Bar with confidence interval */}
                <div className="relative">
                  {isForecast && (
                    <div
                      className="absolute h-2 rounded-full bg-purple-200/40 dark:bg-purple-900/20"
                      style={{
                        left: `${(item.confidence.lower / maxValue) * 100}%`,
                        width: `${
                          ((item.confidence.upper - item.confidence.lower) /
                            maxValue) *
                          100
                        }%`,
                      }}
                    />
                  )}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isForecast
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                      style={{ width: `${percentage}%`, willChange: "width" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <span className="text-gray-600 dark:text-gray-400">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-gray-600 dark:text-gray-400">Predicted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const CostForecastChart = memo(CostForecastChartComponent);
