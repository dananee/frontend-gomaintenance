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

const data = [
  { name: "Jan", maintenance: 4000, fuel: 2400 },
  { name: "Feb", maintenance: 3000, fuel: 1398 },
  { name: "Mar", maintenance: 2000, fuel: 9800 },
  { name: "Apr", maintenance: 2780, fuel: 3908 },
  { name: "May", maintenance: 1890, fuel: 4800 },
  { name: "Jun", maintenance: 2390, fuel: 3800 },
];

export function CostChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
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
              <Bar dataKey="maintenance" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Maintenance" />
              <Bar dataKey="fuel" fill="#f97316" radius={[4, 4, 0, 0]} name="Fuel" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
