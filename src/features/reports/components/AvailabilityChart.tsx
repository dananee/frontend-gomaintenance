"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getFleetAvailability } from "@/features/reports/api/reports";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

export function AvailabilityChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["fleet-availability"],
    queryFn: getFleetAvailability,
  });

  // Transform data for the chart
  const chartData = data
    ? [
        { name: "Active", value: data.active_vehicles },
        { name: "In Maintenance", value: data.in_maintenance_vehicles },
        { name: "Inactive", value: data.inactive_vehicles },
      ]
    : [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fleet Availability</CardTitle>
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
        <CardTitle>Fleet Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length === 0 || data?.total_vehicles === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No fleet data available
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
