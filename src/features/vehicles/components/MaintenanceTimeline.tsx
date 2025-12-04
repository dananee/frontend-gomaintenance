"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDateLong } from "@/lib/formatters";

interface MaintenanceEvent {
  id: string;
  date: string;
  type: "preventive" | "corrective" | "emergency" | "scheduled";
  title: string;
  cost: number;
  duration: number;
  status: "completed" | "upcoming" | "overdue";
  technician?: string;
}

interface MaintenanceTimelineProps {
  events: MaintenanceEvent[];
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "preventive":
      return {
        bg: "bg-green-500",
        border: "border-green-500",
        text: "text-green-600",
      };
    case "emergency":
      return {
        bg: "bg-red-500",
        border: "border-red-500",
        text: "text-red-600",
      };
    case "corrective":
      return {
        bg: "bg-orange-500",
        border: "border-orange-500",
        text: "text-orange-600",
      };
    default:
      return {
        bg: "bg-blue-500",
        border: "border-blue-500",
        text: "text-blue-600",
      };
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-blue-600" />;
  }
};

export function MaintenanceTimeline({ events }: MaintenanceTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">
            Maintenance Timeline
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Timeline Line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {sortedEvents.map((event, index) => {
            const colors = getTypeColor(event.type);
            const isLast = index === sortedEvents.length - 1;

            return (
              <div key={event.id} className="relative pl-10">
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-1 h-8 w-8 rounded-full border-4 ${colors.border} ${colors.bg} flex items-center justify-center shadow-md`}
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>

                {/* Event Card */}
                <div
                  className={`rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(event.status)}
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {event.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDateLong(event.date)}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span
                          className={`rounded-full px-2 py-1 font-medium ${colors.text} bg-current/10`}
                        >
                          {event.type.charAt(0).toUpperCase() +
                            event.type.slice(1)}
                        </span>
                        <span className="text-muted-foreground">
                          💰 {formatCurrency(event.cost)}
                        </span>
                        <span className="text-muted-foreground">
                          ⏱️ {event.duration}h
                        </span>
                        {event.technician && (
                          <span className="text-muted-foreground">
                            👤 {event.technician}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
