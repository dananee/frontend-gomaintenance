"use client";

import { WorkOrder, WorkOrderPriority } from "../types/workOrder.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, User } from "lucide-react";

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onClick?: () => void;
}

const priorityColors: Record<WorkOrderPriority, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function WorkOrderCard({ workOrder, onClick }: WorkOrderCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {workOrder.vehicle_name || "Unknown Vehicle"}
          </h4>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              priorityColors[workOrder.priority]
            }`}
          >
            {workOrder.priority}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {workOrder.description}
        </p>
      </CardHeader>
      
      <CardContent className="p-4 py-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>Due: {workOrder.scheduled_date ? formatDate(workOrder.scheduled_date) : "No date"}</span>
        </div>
        {workOrder.assigned_to_name && (
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <User className="h-3.5 w-3.5" />
            <span>{workOrder.assigned_to_name}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between border-t border-gray-100 p-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span>{workOrder.type}</span>
        <span className="font-mono text-xs opacity-50">#{workOrder.id.slice(0, 6)}</span>
      </CardFooter>
    </Card>
  );
}
