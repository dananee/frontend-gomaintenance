"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";
import { AlertTriangle, Clock, CheckCircle2, Circle } from "lucide-react";
import { formatDateLong } from "@/lib/formatters";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface CalendarDayEventsProps {
    events: ScheduledMaintenanceEvent[];
    date: Date;
    onEventClick: (event: ScheduledMaintenanceEvent) => void;
    maxVisibleEvents?: number;
}

type EventStatus = "overdue" | "due_soon" | "normal";

export function CalendarDayEvents({
    events,
    date,
    onEventClick,
    maxVisibleEvents = 3,
}: CalendarDayEventsProps) {
    const [showAllModal, setShowAllModal] = useState(false);

    // Sort events by priority and due time
    const sortedEvents = [...events].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const aPriority = priorityOrder[a.priority] ?? 4;
        const bPriority = priorityOrder[b.priority] ?? 4;

        if (aPriority !== bPriority) return aPriority - bPriority;

        return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
    });

    const visibleEvents = sortedEvents.slice(0, maxVisibleEvents);
    const remainingCount = sortedEvents.length - visibleEvents.length;

    const getEventStatus = (event: ScheduledMaintenanceEvent): EventStatus => {
        const scheduledDate = new Date(event.scheduled_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        scheduledDate.setHours(0, 0, 0, 0);

        if (scheduledDate < today) return "overdue";

        const daysUntil = Math.floor((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 3) return "due_soon";

        return "normal";
    };

    const getStatusConfig = (status: EventStatus) => {
        switch (status) {
            case "overdue":
                return {
                    bg: "bg-red-50/80 dark:bg-red-950/30",
                    border: "border-red-200 dark:border-red-900/50",
                    icon: AlertTriangle,
                    iconColor: "text-red-600 dark:text-red-400",
                    dotColor: "bg-red-500",
                };
            case "due_soon":
                return {
                    bg: "bg-yellow-50/80 dark:bg-yellow-950/30",
                    border: "border-yellow-200 dark:border-yellow-900/50",
                    icon: Clock,
                    iconColor: "text-yellow-600 dark:text-yellow-400",
                    dotColor: "bg-yellow-500",
                };
            default:
                return {
                    bg: "bg-blue-50/80 dark:bg-blue-950/30",
                    border: "border-blue-200 dark:border-blue-900/50",
                    icon: Circle,
                    iconColor: "text-blue-600 dark:text-blue-400",
                    dotColor: "bg-blue-500",
                };
        }
    };

    return (
        <>
            <div className="flex flex-col gap-1 h-full">
                {/* Desktop: Scrollable event list */}
                <div className="hidden md:flex flex-col gap-1 overflow-y-auto max-h-[120px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pr-1">
                    {visibleEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            status={getEventStatus(event)}
                            statusConfig={getStatusConfig(getEventStatus(event))}
                            onClick={() => onEventClick(event)}
                        />
                    ))}

                    {remainingCount > 0 && (
                        <button
                            onClick={() => setShowAllModal(true)}
                            className="flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30 rounded-md border border-blue-300 dark:border-blue-800 hover:shadow-md transition-all cursor-pointer"
                        >
                            +{remainingCount} more
                        </button>
                    )}
                </div>

                {/* Mobile: Collapsed badge */}
                <div className="md:hidden">
                    {events.length > 0 && (
                        <button
                            onClick={() => setShowAllModal(true)}
                            className="w-full px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-md border border-gray-300 dark:border-gray-600 hover:shadow-md transition-all"
                        >
                            {events.length} {events.length === 1 ? "event" : "events"}
                        </button>
                    )}
                </div>
            </div>

            {/* All Events Modal */}
            <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            Events for {formatDateLong(date)}
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="flex flex-col gap-2">
                            {sortedEvents.map((event) => (
                                <EventCardExpanded
                                    key={event.id}
                                    event={event}
                                    status={getEventStatus(event)}
                                    statusConfig={getStatusConfig(getEventStatus(event))}
                                    onClick={() => {
                                        onEventClick(event);
                                        setShowAllModal(false);
                                    }}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Compact Event Card for Calendar Day Cell
interface EventCardProps {
    event: ScheduledMaintenanceEvent;
    status: EventStatus;
    statusConfig: ReturnType<typeof getStatusConfig>;
    onClick: () => void;
}

function EventCard({ event, status, statusConfig, onClick }: EventCardProps) {
    const { bg, border, icon: Icon, iconColor, dotColor } = statusConfig;

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        onClick={onClick}
                        className={cn(
                            "group relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg border cursor-pointer transition-all duration-200",
                            "hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5",
                            bg,
                            border
                        )}
                    >
                        {/* Status Indicator Dot */}
                        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />

                        {/* Event Content */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                                {event.vehicle_name}
                            </div>
                            <div className="text-[9px] text-gray-600 dark:text-gray-400 truncate leading-tight">
                                {event.title}
                            </div>
                        </div>

                        {/* Priority Icon */}
                        {(event.priority === "high" || event.priority === "critical") && (
                            <Icon className={cn("w-3 h-3 shrink-0", iconColor)} />
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                        <div className="font-semibold">{event.vehicle_name}</div>
                        <div className="text-sm">{event.title}</div>
                        <div className="text-xs text-gray-500">
                            Priority: <span className="capitalize">{event.priority}</span>
                        </div>
                        {event.assigned_to && (
                            <div className="text-xs text-gray-500">
                                Assigned: {event.assigned_to}
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// Expanded Event Card for Modal
function EventCardExpanded({ event, status, statusConfig, onClick }: EventCardProps) {
    const { bg, border, icon: Icon, iconColor, dotColor } = statusConfig;

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case "critical":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
            case "high":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
            case "medium":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
        }
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.01]",
                bg,
                border
            )}
        >
            {/* Status Indicator */}
            <div className="flex flex-col items-center gap-1 pt-1">
                <div className={cn("w-2 h-2 rounded-full", dotColor)} />
                <Icon className={cn("w-4 h-4", iconColor)} />
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0 space-y-2">
                <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {event.vehicle_name}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        {event.title}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs capitalize", getPriorityBadgeColor(event.priority))}>
                        {event.priority}
                    </Badge>

                    {event.assigned_to && (
                        <Badge variant="outline" className="text-xs">
                            {event.assigned_to}
                        </Badge>
                    )}

                    {event.estimated_cost && (
                        <Badge variant="outline" className="text-xs">
                            ${event.estimated_cost}
                        </Badge>
                    )}
                </div>

                {event.description && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {event.description}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper function to get status config (moved outside component for reusability)
function getStatusConfig(status: EventStatus) {
    switch (status) {
        case "overdue":
            return {
                bg: "bg-red-50/80 dark:bg-red-950/30",
                border: "border-red-200 dark:border-red-900/50",
                icon: AlertTriangle,
                iconColor: "text-red-600 dark:text-red-400",
                dotColor: "bg-red-500",
            };
        case "due_soon":
            return {
                bg: "bg-yellow-50/80 dark:bg-yellow-950/30",
                border: "border-yellow-200 dark:border-yellow-900/50",
                icon: Clock,
                iconColor: "text-yellow-600 dark:text-yellow-400",
                dotColor: "bg-yellow-500",
            };
        default:
            return {
                bg: "bg-blue-50/80 dark:bg-blue-950/30",
                border: "border-blue-200 dark:border-blue-900/50",
                icon: Circle,
                iconColor: "text-blue-600 dark:text-blue-400",
                dotColor: "bg-blue-500",
            };
    }
}
