"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

interface TrendBadgeProps {
  value: number;
  label?: string;
}

export function TrendBadge({ value, label = "from last month" }: TrendBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  if (isNeutral) {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        No change {label}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {isPositive ? (
        <>
          <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            +{Math.abs(value)}%
          </span>
        </>
      ) : (
        <>
          <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
          <span className="text-red-600 dark:text-red-400 font-medium">
            {value}%
          </span>
        </>
      )}
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}
