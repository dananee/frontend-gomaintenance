"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, Activity, User, Clock, Loader2 } from "lucide-react";
import { formatDateShort } from "@/lib/formatters";
import { useTranslations } from "next-intl";
import { useVehicleHistory } from "../hooks/useVehicleHistory";
import { cn } from "@/lib/utils";

interface VehicleUnifiedHistoryProps {
    vehicleId: string;
}

const eventTypeConfig = {
    work_order: {
        icon: Wrench,
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        dotColor: "bg-blue-500",
    },
    plan: {
        icon: Calendar,
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        dotColor: "bg-green-500",
    },
    activity: {
        icon: Activity,
        color: "text-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        dotColor: "bg-orange-500",
    },
};

export function VehicleUnifiedHistory({ vehicleId }: VehicleUnifiedHistoryProps) {
    const t = useTranslations("features.vehicles.history");
    const { data: events, isLoading, error } = useVehicleHistory(vehicleId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-gray-500">{t("loading") || "Chargement de l'historique..."}</p>
            </div>
        );
    }

    if (error || !events || events.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <History className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {t("noHistory") || "Aucun historique disponible pour ce véhicule."}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("historyTitle") || "Chronologie du véhicule"}
                </p>
                <Badge variant="outline" className="text-[10px] uppercase font-bold">
                    {events.length} {t("eventsCount") || "Événements"}
                </Badge>
            </div>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-100 dark:bg-gray-800" />

                <div className="space-y-6">
                    {events.map((event) => {
                        const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig] || eventTypeConfig.activity;
                        const Icon = config.icon;

                        return (
                            <div key={event.id} className="relative pl-12">
                                {/* Timeline dot/icon */}
                                <div className={cn(
                                    "absolute left-2.5 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm dark:border-gray-900 dark:bg-gray-900",
                                    config.color
                                )}>
                                    <Icon className="h-3 w-3" />
                                </div>

                                <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {event.title}
                                                    </h4>
                                                    <Badge variant="secondary" className="text-[10px] capitalize h-4">
                                                        {event.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {event.description}
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatDateShort(event.date)}</span>
                                                    </div>
                                                    {event.actor_name && (
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            <span>{event.actor_name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function History({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="m12 7v5l4 2" />
        </svg>
    );
}
