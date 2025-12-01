"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, Clock, XCircle } from "lucide-react";

interface SLAComplianceProps {
  onTime: number;
  delayed: number;
  breached: number;
  totalWOs: number;
}

function SLAComplianceChartComponent({
  onTime,
  delayed,
  breached,
  totalWOs,
}: SLAComplianceProps) {
  const complianceRate = useMemo(
    () => ((onTime / totalWOs) * 100).toFixed(1),
    [onTime, totalWOs]
  );
  const delayedRate = useMemo(
    () => ((delayed / totalWOs) * 100).toFixed(1),
    [delayed, totalWOs]
  );
  const breachedRate = useMemo(
    () => ((breached / totalWOs) * 100).toFixed(1),
    [breached, totalWOs]
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-xl font-semibold">
            SLA Compliance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Compliance Score */}
          <div className="text-center">
            <div className="relative mx-auto h-32 w-32">
              <svg className="h-full w-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${
                    (parseFloat(complianceRate) / 100) * 351.86
                  } 351.86`}
                  strokeLinecap="round"
                  className="text-green-600 transition-all duration-500 dark:text-green-400"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {complianceRate}%
                </p>
                <p className="text-xs text-muted-foreground">On Time</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">On Time</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {onTime}
                </p>
                <p className="text-xs text-muted-foreground">
                  {complianceRate}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium">Delayed</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {delayed}
                </p>
                <p className="text-xs text-muted-foreground">{delayedRate}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium">Breached</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {breached}
                </p>
                <p className="text-xs text-muted-foreground">{breachedRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const SLAComplianceChart = memo(SLAComplianceChartComponent);
