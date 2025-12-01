"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, Gauge, TrendingUp } from "lucide-react";

interface PredictiveMaintenanceProps {
  predictedFailureInDays: number;
  nextOilChangeKm: number;
  currentKm: number;
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
}

export function PredictiveMaintenanceCard({
  predictedFailureInDays,
  nextOilChangeKm,
  currentKm,
  riskLevel,
  recommendations,
}: PredictiveMaintenanceProps) {
  const kmUntilOilChange = nextOilChangeKm - currentKm;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return {
          bg: "from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10",
          border: "border-red-300 dark:border-red-700",
          text: "text-red-600 dark:text-red-400",
          icon: "text-red-600 dark:text-red-400",
        };
      case "medium":
        return {
          bg: "from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10",
          border: "border-yellow-300 dark:border-yellow-700",
          text: "text-yellow-600 dark:text-yellow-400",
          icon: "text-yellow-600 dark:text-yellow-400",
        };
      default:
        return {
          bg: "from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10",
          border: "border-green-300 dark:border-green-700",
          text: "text-green-600 dark:text-green-400",
          icon: "text-green-600 dark:text-green-400",
        };
    }
  };

  const colors = getRiskColor(riskLevel);

  return (
    <Card
      className={`shadow-md bg-gradient-to-br ${colors.bg} border-2 ${colors.border}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`h-5 w-5 ${colors.icon}`} />
          <CardTitle className="text-xl font-semibold">
            Predictive Maintenance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Predictions */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Predicted Failure
                </p>
              </div>
              <p className={`text-3xl font-bold ${colors.text}`}>
                {predictedFailureInDays} days
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on usage patterns
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Next Oil Change
                </p>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {kmUntilOilChange.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                km remaining ({nextOilChangeKm.toLocaleString()} km)
              </p>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Risk Assessment</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${colors.text} bg-current/10`}
              >
                {riskLevel}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full ${colors.bg
                  .split(" ")[0]
                  .replace("from-", "bg-")
                  .replace("/50", "")}`}
                style={{
                  width:
                    riskLevel === "high"
                      ? "85%"
                      : riskLevel === "medium"
                      ? "55%"
                      : "25%",
                }}
              />
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold">AI Recommendations</p>
            </div>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">
                    •
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
