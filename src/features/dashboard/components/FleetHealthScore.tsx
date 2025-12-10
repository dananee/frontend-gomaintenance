"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useTranslations } from "next-intl";

interface FleetHealthData {
  overall_score: number;
  healthy_vehicles: number;
  maintenance_due: number;
  critical_vehicles: number;
  status: "excellent" | "good" | "fair" | "poor" | "critical";
}

interface FleetHealthScoreProps {
  data: FleetHealthData;
  previousScore?: number;
  onClick?: () => void;
}

function getStatusColor(status: FleetHealthData["status"]) {
  switch (status) {
    case "excellent":
    case "good":
      return "text-green-600 dark:text-green-400";
    case "fair":
      return "text-yellow-600 dark:text-yellow-400";
    case "poor":
      return "text-orange-600 dark:text-orange-400";
    case "critical":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

function getStatusBg(status: FleetHealthData["status"]) {
  switch (status) {
    case "excellent":
    case "good":
      return "from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800/30";
    case "fair":
      return "from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-800/30";
    case "poor":
      return "from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border-orange-200 dark:border-orange-800/30";
    case "critical":
      return "from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border-red-200 dark:border-red-800/30";
    default:
      return "bg-card";
  }
}

function FleetHealthScoreComponent({
  data,
  previousScore = 84,
  onClick,
}: FleetHealthScoreProps) {
  const t = useTranslations("features.dashboard.fleetHealth");
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
            {t("title")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${statusColor}`}>
                {data.overall_score}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                / 100
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`text-sm font-bold ${
                  hasImproved ? "text-green-600" : "text-red-600"
                }`}
              >
                {hasImproved ? "+" : ""}
                {scoreDiff}
              </span>
              <span className="text-xs text-muted-foreground">
                vs last month
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.healthy_vehicles}
              </span>
              <span className="text-xs font-medium text-green-800 dark:text-green-300">
                {t("healthy")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {data.maintenance_due}
              </span>
              <span className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                {t("due")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.critical_vehicles}
              </span>
              <span className="text-xs font-medium text-red-800 dark:text-red-300">
                {t("critical")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-center w-full text-muted-foreground hover:text-primary transition-colors">
          {t("clickToView")}
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
