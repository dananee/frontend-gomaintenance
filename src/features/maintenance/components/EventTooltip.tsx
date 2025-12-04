"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";
import { getStatusColor } from "../utils/colorMappings";
import { formatStatus } from "../utils/colorMappings";

interface EventTooltipProps {
  event: ScheduledMaintenanceEvent;
  isVisible: boolean;
  position: { x: number; y: number };
}

export function EventTooltip({ event, isVisible, position }: EventTooltipProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="space-y-2">
        <div>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
            {event.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {event.vehicle_name}
          </p>
        </div>

        {event.assigned_to && (
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <span className="font-medium">Technician:</span> {event.assigned_to}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-xs", getStatusColor(event.status))}
          >
            {formatStatus(event.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
