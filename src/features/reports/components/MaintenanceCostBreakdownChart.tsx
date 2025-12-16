"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

interface MaintenanceCostBreakdownChartProps {
  data?: Array<{
    category: string;
    labor: number;
    parts: number;
    other: number;
  }>;
  dateRange?: string;
}

const defaultData = [
  { category: "Engine", labor: 4000, parts: 2400, other: 500 },
  { category: "Brakes", labor: 3000, parts: 1800, other: 300 },
  { category: "Tires", labor: 1500, parts: 3200, other: 200 },
  { category: "Electrical", labor: 2500, parts: 1600, other: 400 },
  { category: "Suspension", labor: 2200, parts: 1400, other: 350 },
  { category: "Fluids", labor: 800, parts: 600, other: 150 },
];

export function MaintenanceCostBreakdownChart({
  data = defaultData,
  dateRange,
}: MaintenanceCostBreakdownChartProps) {
  const t = useTranslations("features.reports.breakdown");
  const totalCost = data.reduce(
    (sum, item) => sum + item.labor + item.parts + item.other,
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            {dateRange && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {dateRange}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalCost.toLocaleString()} MAD
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("totalCost")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-800"
              />
              <XAxis
                dataKey="category"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} MAD`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => {
                  const rawValue = Array.isArray(value) ? value[0] : value;
                  const numericValue =
                    typeof rawValue === "number"
                      ? rawValue
                      : typeof rawValue === "string"
                      ? Number(rawValue)
                      : 0;

                  return `${numericValue.toLocaleString()} MAD`;
                }}
              />
              <Legend />
              <Bar
                dataKey="labor"
                stackId="a"
                fill="#3b82f6"
                radius={[0, 0, 0, 0]}
                name={t("labor")}
              />
              <Bar
                dataKey="parts"
                stackId="a"
                fill="#f97316"
                radius={[0, 0, 0, 0]}
                name={t("parts")}
              />
              <Bar
                dataKey="other"
                stackId="a"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name={t("other")}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-sm bg-blue-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("labor")}
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {data.reduce((sum, item) => sum + item.labor, 0).toLocaleString()}{" "}
              MAD
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-sm bg-orange-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("parts")}
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {data.reduce((sum, item) => sum + item.parts, 0).toLocaleString()}{" "}
              MAD
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-sm bg-purple-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("other")}
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {data.reduce((sum, item) => sum + item.other, 0).toLocaleString()}{" "}
              MAD
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
