import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface PremiumMetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: "purple" | "blue" | "green" | "orange" | "teal" | "rose" | "slate" | "indigo";
    className?: string;
}

const variantStyles = {
    purple: {
        gradient: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200/50 dark:border-purple-800/50",
    },
    blue: {
        gradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200/50 dark:border-blue-800/50",
    },
    green: {
        gradient: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200/50 dark:border-emerald-800/50",
    },
    orange: {
        gradient: "bg-gradient-to-br from-orange-500/10 to-orange-600/5",
        iconBg: "bg-orange-500/10",
        iconColor: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200/50 dark:border-orange-800/50",
    },
    teal: {
        gradient: "bg-gradient-to-br from-teal-500/10 to-teal-600/5",
        iconBg: "bg-teal-500/10",
        iconColor: "text-teal-600 dark:text-teal-400",
        border: "border-teal-200/50 dark:border-teal-800/50",
    },
    rose: {
        gradient: "bg-gradient-to-br from-rose-500/10 to-rose-600/5",
        iconBg: "bg-rose-500/10",
        iconColor: "text-rose-600 dark:text-rose-400",
        border: "border-rose-200/50 dark:border-rose-800/50",
    },
    slate: {
        gradient: "bg-gradient-to-br from-slate-500/10 to-slate-600/5",
        iconBg: "bg-slate-500/10",
        iconColor: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200/50 dark:border-slate-800/50",
    },
    indigo: {
        gradient: "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5",
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200/50 dark:border-indigo-800/50",
    },
};

export function PremiumMetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = "blue",
    className,
}: PremiumMetricCardProps) {
    const styles = variantStyles[variant];

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                "hover:shadow-lg hover:scale-[1.02]",
                styles.gradient,
                styles.border,
                "bg-card",
                className
            )}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />

            <div className="relative flex items-start justify-between">
                {/* Left side - Content */}
                <div className="flex-1 space-y-2">
                    {/* Title */}
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {title}
                    </p>

                    {/* Value */}
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold tracking-tight text-foreground">
                            {value}
                        </p>

                        {/* Trend indicator */}
                        {trend && (
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                    trend.isPositive
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                )}
                            >
                                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                            </span>
                        )}
                    </div>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Right side - Icon */}
                {Icon && (
                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
                            styles.iconBg
                        )}
                    >
                        <Icon className={cn("h-6 w-6", styles.iconColor)} />
                    </div>
                )}
            </div>
        </div>
    );
}
