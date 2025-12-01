"use client";

import { memo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?:
    | "blue"
    | "green"
    | "orange"
    | "red"
    | "purple"
    | "yellow"
    | "cyan";
  href?: string;
}

const colorSchemes = {
  blue: {
    border: "border-blue-200 dark:border-blue-900/50",
    hoverBorder: "hover:border-blue-400 dark:hover:border-blue-700",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconHoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueColor: "text-blue-600 dark:text-blue-400",
    gradient:
      "from-blue-50 via-blue-50/50 to-transparent dark:from-blue-900/20 dark:via-blue-900/10 dark:to-transparent",
  },
  green: {
    border: "border-green-200 dark:border-green-900/50",
    hoverBorder: "hover:border-green-400 dark:hover:border-green-700",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconHoverBg: "group-hover:bg-green-200 dark:group-hover:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-green-600 dark:text-green-400",
    gradient:
      "from-green-50 via-blue-50/30 to-transparent dark:from-green-900/20 dark:via-blue-900/10 dark:to-transparent",
  },
  orange: {
    border: "border-orange-200 dark:border-orange-900/50",
    hoverBorder: "hover:border-orange-400 dark:hover:border-orange-700",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconHoverBg: "group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    valueColor: "text-orange-600 dark:text-orange-400",
    gradient:
      "from-orange-50 via-red-50/30 to-transparent dark:from-orange-900/20 dark:via-red-900/10 dark:to-transparent",
  },
  red: {
    border: "border-red-200 dark:border-red-900/50",
    hoverBorder: "hover:border-red-400 dark:hover:border-red-700",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconHoverBg: "group-hover:bg-red-200 dark:group-hover:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    valueColor: "text-red-600 dark:text-red-400",
    gradient:
      "from-red-50 via-orange-50/30 to-transparent dark:from-red-900/20 dark:via-orange-900/10 dark:to-transparent",
  },
  purple: {
    border: "border-purple-200 dark:border-purple-900/50",
    hoverBorder: "hover:border-purple-400 dark:hover:border-purple-700",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconHoverBg: "group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    valueColor: "text-purple-600 dark:text-purple-400",
    gradient:
      "from-purple-50 via-blue-50/30 to-transparent dark:from-purple-900/20 dark:via-blue-900/10 dark:to-transparent",
  },
  yellow: {
    border: "border-yellow-200 dark:border-yellow-900/50",
    hoverBorder: "hover:border-yellow-400 dark:hover:border-yellow-700",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconHoverBg: "group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    valueColor: "text-yellow-600 dark:text-yellow-400",
    gradient:
      "from-yellow-50 via-orange-50/30 to-transparent dark:from-yellow-900/20 dark:via-orange-900/10 dark:to-transparent",
  },
  cyan: {
    border: "border-cyan-200 dark:border-cyan-900/50",
    hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-700",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    iconHoverBg: "group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    valueColor: "text-cyan-600 dark:text-cyan-400",
    gradient:
      "from-cyan-50 via-blue-50/30 to-transparent dark:from-cyan-900/20 dark:via-blue-900/10 dark:to-transparent",
  },
};

export function DashboardKPICardComponent({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = "blue",
  href,
}: DashboardKPICardProps) {
  const colors = colorSchemes[colorScheme];
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  const cardContent = (
    <Card
      className={`group relative min-h-[125px] overflow-hidden ${
        colors.border
      } ${
        href ? `cursor-pointer ${colors.hoverBorder}` : ""
      } bg-gradient-to-br ${
        colors.gradient
      } shadow-lg transition-all duration-150 hover:shadow-xl`}
      style={{ willChange: "box-shadow" }}
    >
      {/* Glass-like overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none" />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-6">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </CardTitle>
        <div
          className={`rounded-xl ${colors.iconBg} ${colors.iconHoverBg} p-2.5 transition-all duration-150 group-hover:scale-110 shadow-sm`}
          style={{ willChange: "transform" }}
        >
          <Icon
            className={`h-5 w-5 ${colors.iconColor} transition-transform duration-150`}
          />
        </div>
      </CardHeader>
      <CardContent className="relative px-5 pb-6">
        <div className={`text-3xl font-bold ${colors.valueColor}`}>{value}</div>
        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-2">
            {trend && TrendIcon && (
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  trend.isPositive
                    ? "text-green-700 bg-green-100/80 dark:text-green-400 dark:bg-green-900/30"
                    : "text-red-700 bg-red-100/80 dark:text-red-400 dark:bg-red-900/30"
                }`}
              >
                <TrendIcon className="h-3 w-3" />
                {Math.abs(trend.value)}%
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <a href={href}>{cardContent}</a>;
  }

  return cardContent;
}

export const DashboardKPICard = memo(DashboardKPICardComponent);
