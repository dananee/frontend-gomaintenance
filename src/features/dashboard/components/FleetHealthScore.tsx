"use client";

import { memo, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { FleetHealthScore as FleetHealthScoreType } from "../types/dashboardKPI.types";

interface FleetHealthScoreProps {
  data: FleetHealthScoreType;
  previousScore?: number;
  onClick?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "text-green-600";
    case "good":
      return "text-blue-600";
    case "fair":
      return "text-yellow-600";
    case "poor":
      return "text-orange-600";
    case "critical":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case "excellent":
      return "from-green-50 to-green-100/50";
    case "good":
      return "from-blue-50 to-blue-100/50";
    case "fair":
      return "from-yellow-50 to-yellow-100/50";
    case "poor":
      return "from-orange-50 to-orange-100/50";
    case "critical":
      return "from-red-50 to-red-100/50";
    default:
      return "from-gray-50 to-gray-100/50";
  }
};

function FleetHealthScoreComponent({
  data,
  previousScore = 84,
  onClick,
}: FleetHealthScoreProps) {
  const statusColor = useMemo(() => getStatusColor(data.status), [data.status]);
  const statusBg = useMemo(() => getStatusBg(data.status), [data.status]);
  const scoreDiff = useMemo(() => data.overall_score - previousScore, [data.overall_score, previousScore]);
  const hasImproved = scoreDiff > 0;

  const cardContent = (
    <Card
      className={`shadow-md bg-gradient-to-br ${statusBg} border-2 transition-all duration-150 hover:shadow-xl ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Activity className={`h-5 w-5 ${statusColor}`} />
          <CardTitle className="text-xl font-semibold">
            Fleet Health Score
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score Circle with Glow */}
          <div className="flex flex-col items-center">
            <div className="relative h-32 w-32">

              <svg className="rotate-[-90deg] h-full w-full relative z-10">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${
                    (data.overall_score / 100) * 351.86
                  } 351.86`}
                  className={`${statusColor} transition-all duration-500`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className={`text-4xl font-bold ${statusColor}`}>
                  {data.overall_score}
                </p>
                <p className="text-xs text-muted-foreground uppercase">
                  {data.status}
                </p>
                {/* Trend Arrow */}
                {scoreDiff !== 0 && (
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                      hasImproved
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {hasImproved ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(scoreDiff)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-2xl font-bold">{data.healthy_vehicles}</p>
              </div>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-2xl font-bold">{data.maintenance_due}</p>
              </div>
              <p className="text-xs text-muted-foreground">Due</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-2xl font-bold">{data.critical_vehicles}</p>
              </div>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-center w-full text-muted-foreground hover:text-primary transition-colors">
          Click to view full health report →
        </p>
      </CardFooter>
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return cardContent;
}

export const FleetHealthScore = memo(FleetHealthScoreComponent);
