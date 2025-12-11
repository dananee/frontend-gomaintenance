"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";
import { formatDateLong } from "@/lib/formatters";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CompactDayEventsProps {
    events: ScheduledMaintenanceEvent[];
    date: Date;
    onEventClick: (event: ScheduledMaintenanceEvent) => void;
}

export function CompactDayEvents({
    events,
    date,
    onEventClick,
}: CompactDayEventsProps) {
    const t = useTranslations("features.maintenance.calendar");
    const [showModal, setShowModal] = useState(false);

    // Sort by priority then time
    const sortedEvents = [...events].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const aPriority = priorityOrder[a.priority] ?? 4;
        const bPriority = priorityOrder[b.priority] ?? 4;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
    });

    const visibleEvents = sortedEvents.slice(0, 3);
    const remainingCount = sortedEvents.length - 3;

    const getPriorityColor = (event: ScheduledMaintenanceEvent) => {
        const scheduledDate = new Date(event.scheduled_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        scheduledDate.setHours(0, 0, 0, 0);

        // Overdue
        if (scheduledDate < today) {
            return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/70 dark:hover:bg-red-950/30";
        }

        // Due soon (within 3 days)
        const daysUntil = Math.floor((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 3) {
            return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20 hover:bg-yellow-100/70 dark:hover:bg-yellow-950/30";
        }

        // Normal
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/70 dark:hover:bg-blue-950/30";
    };

    return (
        <>
            <div className="flex flex-col gap-0.5 overflow-hidden">
                {visibleEvents.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={cn(
                            "h-6 px-2 py-1 rounded-md border-l-2 cursor-pointer transition-all text-[10px] leading-tight flex items-center",
                            getPriorityColor(event)
                        )}
                        title={`${event.vehicle_name} - ${event.title}`}
                    >
                        <span className="font-semibold truncate">{event.vehicle_name}</span>
                    </div>
                ))}

                {remainingCount > 0 && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="h-6 px-2 py-1 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center transition-all"
                    >
                        {t("moreEvents", { count: remainingCount })}
                    </button>
                )}
            </div>

            {/* Modal for all events */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {t("eventsTitle", { date: formatDateLong(date) })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {sortedEvents.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => {
                                    onEventClick(event);
                                    setShowModal(false);
                                }}
                                className={cn(
                                    "p-3 rounded-lg border-l-4 cursor-pointer transition-all",
                                    getPriorityColor(event)
                                )}
                            >
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                    {event.vehicle_name}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {event.title}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="capitalize">{event.priority}</span>
                                    {event.assigned_to && <span>• {event.assigned_to}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
