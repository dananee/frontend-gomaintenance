"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface TrendBadgeProps {
  value: number;
  label?: string;
}

export function TrendBadge({
  value,
  label = "from last month",
}: TrendBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  if (isNeutral) {
    return (
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
          <Minus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          <span className="font-semibold text-gray-600 dark:text-gray-400">
            0%
          </span>
        </div>
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
      </div>
    );
  }

  return (
    <div className="mt-1 flex items-center gap-1.5 text-xs">
      {isPositive ? (
        <>
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 dark:bg-green-900/30">
            <ArrowUp className="h-3 w-3 text-green-700 dark:text-green-400" />
            <span className="font-semibold text-green-700 dark:text-green-400">
              +{Math.abs(value)}%
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 dark:bg-red-900/30">
            <ArrowDown className="h-3 w-3 text-red-700 dark:text-red-400" />
            <span className="font-semibold text-red-700 dark:text-red-400">
              {value}%
            </span>
          </div>
        </>
      )}
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}
