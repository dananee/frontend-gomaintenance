"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { WorkOrderStatusDistribution } from "../types/dashboardKPI.types";

interface WorkOrderPieChartProps {
  data: WorkOrderStatusDistribution[];
}

function WorkOrderPieChartComponent({ data }: WorkOrderPieChartProps) {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data]
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">
            Work Order Distribution
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Donut Chart */}
          <div className="relative mx-auto h-48 w-48">
            <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
              {
                data.reduce(
                  (acc, item, index) => {
                    const percentage = item.percentage;
                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                    const offset = acc.offset;
                    acc.offset += percentage;

                    return {
                      offset: acc.offset,
                      elements: [
                        ...acc.elements,
                        <circle
                          key={item.status}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={-offset}
                          className="transition-all duration-150 hover:opacity-80"
                          style={{ willChange: "opacity" }}
                        />,
                      ],
                    };
                  },
                  { offset: 0, elements: [] as React.ReactNode[] }
                ).elements
              }
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">Total WOs</p>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3">
            {data.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <p className="text-xs font-medium">{item.status}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const WorkOrderPieChart = memo(WorkOrderPieChartComponent);
