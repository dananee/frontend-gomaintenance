"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, TrendingUp } from "lucide-react";

interface TechnicianPerformance {
  name: string;
  completed_wos: number;
  avg_time: number;
  efficiency_score: number;
}

interface TechnicianPerformanceChartProps {
  data: TechnicianPerformance[];
}

function TechnicianPerformanceChartComponent({
  data,
}: TechnicianPerformanceChartProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl font-semibold">
            Technician Performance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((tech, index) => (
            <div
              key={tech.name}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-600"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20">
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {tech.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tech.completed_wos} WOs • {tech.avg_time.toFixed(1)}h avg
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {tech.efficiency_score}%
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Efficiency</span>
                  </div>
                </div>
                {index === 0 && <Award className="h-6 w-6 text-yellow-500" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const TechnicianPerformanceChart = memo(TechnicianPerformanceChartComponent);
