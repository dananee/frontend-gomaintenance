"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useTranslations } from "next-intl";

interface FuelUsageTrendChartProps {
  data?: Array<{
    month: string;
    usage: number;
    cost: number;
    avgMpg: number;
  }>;
  dateRange?: string;
}

const defaultData = [
  { month: "Jan", usage: 1200, cost: 4800, avgMpg: 6.5 },
  { month: "Feb", usage: 1100, cost: 4400, avgMpg: 6.8 },
  { month: "Mar", usage: 1350, cost: 5400, avgMpg: 6.3 },
  { month: "Apr", usage: 1250, cost: 5000, avgMpg: 6.6 },
  { month: "May", usage: 1400, cost: 5600, avgMpg: 6.2 },
  { month: "Jun", usage: 1300, cost: 5200, avgMpg: 6.5 },
];

export function FuelUsageTrendChart({
  data = defaultData,
  dateRange,
}: FuelUsageTrendChartProps) {
  const t = useTranslations("features.reports.fuel");
  const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  const avgMpg = (
    data.reduce((sum, item) => sum + item.avgMpg, 0) / data.length
  ).toFixed(1);

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
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("totalGallons")}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalUsage.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("totalCost")}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalCost.toLocaleString()} MAD
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("avgMpg")}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {avgMpg}
            </p>
          </div>
        </div>

        {/* Fuel Usage Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-800"
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
                formatter={(value, name) => {
                  const rawValue = Array.isArray(value) ? value[0] : value;
                  const numericValue =
                    typeof rawValue === "number"
                      ? rawValue
                      : typeof rawValue === "string"
                      ? Number(rawValue)
                      : 0;

                  if (name === "Cost" || name === t("cost"))
                    return [`${numericValue.toLocaleString()} MAD`, t("cost")];
                  if (name === "MPG" || name === t("mpg"))
                    return [numericValue.toFixed(1), t("mpg")];
                  return [`${numericValue.toLocaleString()} gal`, t("usage")];
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="usage"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsage)"
                name={t("usage")}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cost"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                name={t("cost")}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgMpg"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                name={t("mpg")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
