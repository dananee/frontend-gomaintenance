"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertTriangle, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface FailurePrediction {
  vehicle_id: string;
  vehicle_name: string;
  risk_score: number; // 0-100
  predicted_failure_days: number;
  component: string;
  confidence: number; // 0-100;
}

interface FailurePredictionWidgetProps {
  predictions: FailurePrediction[];
}

function FailurePredictionWidgetComponent({
  predictions,
}: FailurePredictionWidgetProps) {
  const t = useTranslations("features.dashboard.failurePrediction");

  const getRiskColor = useMemo(
    () => (score: number) => {
      if (score >= 75)
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800/50",
          text: "text-red-700 dark:text-red-400",
          badge: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300",
        };
      if (score >= 50)
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-800/50",
          text: "text-orange-700 dark:text-orange-400",
          badge:
            "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300",
        };
      return {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800/50",
        text: "text-yellow-700 dark:text-yellow-400",
        badge:
          "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
      };
    },
    []
  );

  const highestRisk = predictions[0];
  const avgConfidence = useMemo(
    () =>
      (
        predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      ).toFixed(0),
    [predictions]
  );

  return (
    <Card className="shadow-lg border-2 border-purple-200 dark:border-purple-900/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2 shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                {t("title")}
              </CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {avgConfidence}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t("confidence")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {predictions.map((prediction) => {
            const colors = getRiskColor(prediction.risk_score);

            return (
              <div
                key={prediction.vehicle_id}
                className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4 transition-all duration-150 hover:shadow-lg cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`h-4 w-4 ${colors.text}`} />
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {prediction.vehicle_name}
                      </h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}
                      >
                        {t("riskBadge", { score: prediction.risk_score })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t("component")}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {prediction.component}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t("predictedFailure")}
                        </p>
                        <p className={`font-bold ${colors.text}`}>
                          {t("days", { days: prediction.predicted_failure_days })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Confidence indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative h-16 w-16">
                      <svg className="h-full w-full -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={`${
                            (prediction.confidence / 100) * 175.93
                          } 175.93`}
                          strokeLinecap="round"
                          className={colors.text}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${colors.text}`}>
                          {prediction.confidence}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t("aiScore")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Model Info */}
        <div className="mt-4 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 p-3 border border-purple-200 dark:border-purple-800/30">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-purple-900 dark:text-purple-300">
              {t("modelInfo")}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t("modelDesc")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export const FailurePredictionWidget = memo(FailurePredictionWidgetComponent);
