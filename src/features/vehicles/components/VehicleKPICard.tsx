import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VehicleKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down" | "stable";
  };
  subtitle?: string;
  colorScheme?: "blue" | "green" | "purple" | "amber" | "red" | "gray" | "cyan";
  className?: string;
  iconClassName?: string;
}

const colorSchemes = {
  blue: {
    bg: "from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    text: "text-blue-900 dark:text-blue-100",
  },
  green: {
    bg: "from-green-50 via-blue-50/30 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    text: "text-green-900 dark:text-green-100",
  },
  purple: {
    bg: "from-purple-50 via-blue-50/30 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-600 dark:text-purple-400",
    text: "text-purple-900 dark:text-purple-100",
  },
  amber: {
    bg: "from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10",
    border: "border-amber-200 dark:border-amber-800",
    icon: "text-amber-600 dark:text-amber-400",
    text: "text-amber-900 dark:text-amber-100",
  },
  red: {
    bg: "from-red-50 via-orange-50/30 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    text: "text-red-900 dark:text-red-100",
  },
  gray: {
    bg: "from-gray-50 to-gray-100/50 dark:from-gray-800/20 dark:to-gray-700/10",
    border: "border-gray-200 dark:border-gray-700",
    icon: "text-gray-600 dark:text-gray-400",
    text: "text-gray-900 dark:text-gray-100",
  },
  cyan: {
    bg: "from-cyan-50 via-blue-50/30 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-800/10",
    border: "border-cyan-200 dark:border-cyan-800",
    icon: "text-cyan-600 dark:text-cyan-400",
    text: "text-cyan-900 dark:text-cyan-100",
  },
};

export function VehicleKPICard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  colorScheme = "blue",
  className,
  iconClassName,
}: VehicleKPICardProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <Card
      className={cn(
        `min-h-[125px] border ${colors.border} bg-gradient-to-br ${colors.bg} shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`,
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className={cn("text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400", className && "text-white/70")}>
              {title}
            </p>
            <p className={cn(`text-3xl font-bold ${colors.text}`, className && "text-white")}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className={cn("text-xs text-gray-500 dark:text-gray-400", className && "text-white/60")}>
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                {trend.direction === "up" ? (
                  <TrendingUp className={cn("h-3 w-3 text-green-600 dark:text-green-400", className && "text-white")} />
                ) : trend.direction === "down" ? (
                  <TrendingDown className={cn("h-3 w-3 text-red-600 dark:text-red-400", className && "text-white")} />
                ) : null}
                <span
                  className={cn(
                    `text-xs font-medium ${
                      trend.direction === "up"
                        ? "text-green-600 dark:text-green-400"
                        : trend.direction === "down"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500"
                    }`,
                    className && "text-white"
                  )}
                >
                  {trend.direction !== "stable" && (
                    <>
                      {trend.direction === "up" ? "+" : ""}
                      {trend.value}%
                    </>
                  )}
                  {trend.direction === "stable" && "No change"}
                </span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <Icon className={cn(`h-10 w-10 ${colors.icon}`, iconClassName)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
