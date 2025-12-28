"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { User, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";
import { getPriorityColor } from "../utils/colorMappings";

interface MaintenanceEventProps {
  event: ScheduledMaintenanceEvent;
  onClick: (event: ScheduledMaintenanceEvent) => void;
}

export const MaintenanceEvent = memo(function MaintenanceEvent({
  event,
  onClick,
}: MaintenanceEventProps) {
  const t = useTranslations("features.maintenance.tooltips");
  const isHighPriority = event.priority === "high" || event.priority === "critical";

  return (
    <div
      onClick={() => onClick(event)}
      className={cn(
        "group relative flex flex-col gap-0.5 rounded-md border px-1.5 py-1 text-[10px] transition-all cursor-pointer",
        isHighPriority
          ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-300 dark:border-red-700 shadow-md hover:shadow-lg hover:shadow-red-200/50 dark:hover:shadow-red-900/30 animate-pulse-subtle"
          : "shadow-sm hover:shadow-md",
        getPriorityColor(event.priority)
      )}
      title={isHighPriority ? t("highPriorityMaintenance") : undefined}
    >
      {/* High Priority Indicator */}
      {isHighPriority && (
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 shadow-lg">
          <AlertTriangle className="h-2.5 w-2.5 text-white" />
        </div>
      )}

      {/* Left accent bar for high priority */}
      {isHighPriority && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-l-md" />
      )}

      <div className={cn("font-semibold truncate", isHighPriority && "pl-1")}>
        {event.vehicle_name}
      </div>
      <div className={cn("truncate opacity-75", isHighPriority && "pl-1 font-medium")}>
        {event.title}
      </div>

      {/* Hover Details */}
      <div className="hidden group-hover:flex items-center gap-2 mt-1 pt-1 border-t border-black/5 dark:border-white/5">
        {event.assigned_to && (
          <div className="flex items-center gap-1" title={event.assigned_to}>
            <User className="h-3 w-3" />
            <span className="truncate max-w-[60px]">
              {event.assigned_to.split(" ")[0]}
            </span>
          </div>
        )}
        {event.estimated_cost && (
          <div className="flex items-center gap-0.5">
            <DollarSign className="h-3 w-3" />
            <span>{formatCurrency(event.estimated_cost)}</span>
          </div>
        )}
      </div>
    </div>
  );
});
