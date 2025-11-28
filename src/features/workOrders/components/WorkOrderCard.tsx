"use client";

import { WorkOrder, WorkOrderPriority } from "../types/workOrder.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onClick?: () => void;
}

const priorityColors: Record<WorkOrderPriority, string> = {
  low: "border-l-blue-500",
  medium: "border-l-yellow-500",
  high: "border-l-orange-500",
  urgent: "border-l-red-500",
};

const priorityBadgeColors: Record<WorkOrderPriority, "info" | "warning" | "destructive"> = {
  low: "info",
  medium: "warning",
  high: "warning",
  urgent: "destructive",
};

export function WorkOrderCard({ workOrder, onClick }: WorkOrderCardProps) {
  return (
    <Card 
      className={`cursor-pointer border-l-4 transition-all hover:shadow-lg ${priorityColors[workOrder.priority]}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {workOrder.vehicle_name || "Unknown Vehicle"}
          </h4>
          <Badge variant={priorityBadgeColors[workOrder.priority]} className="shrink-0 text-xs">
            {workOrder.priority}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
          {workOrder.description || workOrder.title}
        </p>
      </CardHeader>
      
      <CardContent className="p-4 py-2 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>Due: {workOrder.scheduled_date ? formatDate(workOrder.scheduled_date) : "No date"}</span>
        </div>
        {workOrder.assigned_to_name && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-400">
                {workOrder.assigned_to_name.charAt(0)}
              </div>
            </Avatar>
            <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
              {workOrder.assigned_to_name}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between border-t border-gray-100 p-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span className="capitalize">{workOrder.type}</span>
        <span className="font-mono text-xs opacity-50">#{workOrder.id.slice(0, 6)}</span>
      </CardFooter>
    </Card>
  );
}
