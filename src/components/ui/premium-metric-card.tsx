import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface PremiumMetricCardProps {
    title: string;
    value: string | number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
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
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
    },
    blue: {
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
    },
    green: {
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
    },
    orange: {
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
    },
    teal: {
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-teal-100 dark:bg-teal-900/30",
        iconColor: "text-teal-600 dark:text-teal-400",
        border: "border-teal-200 dark:border-teal-800",
    },
    rose: {
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-rose-100 dark:bg-rose-900/30",
        iconColor: "text-rose-600 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-800",
    },
    slate: {
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-slate-100 dark:bg-slate-900/30",
        iconColor: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-800",
    },
    indigo: {
        bg: "bg-white dark:bg-slate-900",
        iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800",
    },
};

import { AnimatedNumber } from "./animated-number";

export function PremiumMetricCard({
    title,
    value,
    suffix,
    prefix,
    decimals,
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
                "group relative overflow-hidden rounded-xl border p-5 transition-all duration-300",
                "hover:shadow-md hover:border-transparent",
                styles.bg,
                styles.border,
                className
            )}
        >
            {/* Subtle glow on hover */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500",
                "bg-gradient-to-br from-transparent to-current"
            )} />

            <div className="relative flex flex-col h-full">
                {/* Header - Title & Icon */}
                <div className="flex items-start justify-between mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        {title}
                    </p>
                    {Icon && (
                        <div className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
                            styles.iconBg
                        )}>
                            <Icon className={cn("h-5 w-5", styles.iconColor)} />
                        </div>
                    )}
                </div>

                {/* Body - Value & Subtitle */}
                <div className="flex-1 space-y-1">
                    <div className="text-3xl font-extrabold tracking-tight text-foreground">
                        {typeof value === "number" ? (
                            <AnimatedNumber
                                value={value}
                                suffix={suffix}
                                prefix={prefix}
                                decimals={decimals}
                            />
                        ) : (
                            value
                        )}
                    </div>

                    {subtitle && (
                        <p className="text-xs font-medium text-muted-foreground/70">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Footer - Trend */}
                {trend && (
                    <div className="mt-3">
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                                trend.isPositive
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            )}
                        >
                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
