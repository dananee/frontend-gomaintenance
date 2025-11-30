"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getMaintenanceCosts } from "@/features/reports/api/reports";

export function CostChart() {
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

  // Transform data for the chart
  const chartData = data?.monthly_data || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading chart data...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No cost data available
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="labor_cost"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Labor"
                />
                <Bar
                  dataKey="parts_cost"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  name="Parts"
                />
                <Bar
                  dataKey="external_service_cost"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  name="External Services"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
