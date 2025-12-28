"use client";

import { WorkOrder, WorkOrderPriority, WorkOrderStatus } from "../types/workOrder.types";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateShort } from "@/lib/formatters";
import { Calendar, MoreVertical, Edit, Trash2, Clock, PlayCircle, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onClick?: () => void;
  onEdit?: (workOrder: WorkOrder) => void;
  onDelete?: (workOrder: WorkOrder) => void;
}

const priorityColors: Record<WorkOrderPriority, string> = {
  low: "border-l-4 border-l-slate-400",
  medium: "border-l-4 border-l-yellow-500",
  high: "border-l-4 border-l-orange-500",
  urgent: "border-l-4 border-l-red-500",
};

const priorityBadgeColors: Record<WorkOrderPriority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusConfig: Record<WorkOrderStatus, {
  color: string;
  bgColor: string;
  icon: React.ElementType;
}> = {
  pending: {
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    icon: Clock,
  },
  in_progress: {
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: PlayCircle,
  },
  completed: {
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: CheckCircle,
  },
  cancelled: {
    color: "text-slate-700 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-900/30",
    icon: XCircle,
  },
};

export function WorkOrderCard({ workOrder, onClick, onEdit, onDelete }: WorkOrderCardProps) {
  const t = useTranslations("workOrders");
  const StatusIcon = statusConfig[workOrder.status].icon;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] ${priorityColors[workOrder.priority]} relative group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm`}
    >
      {/* Three-dot menu */}
      <div className="absolute right-2 top-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(workOrder);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("card.actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(workOrder);
              }}
              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("card.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div onClick={onClick}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2 pr-8">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 flex-1">
              {workOrder.vehicle_name || t("card.unknownVehicle")}
            </h4>
            <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${priorityBadgeColors[workOrder.priority]}`}>
              {t(`priorities.${workOrder.priority}`)}
            </span>
          </div>

          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {workOrder.description || workOrder.title}
          </p>
        </CardHeader>

        <CardContent className="p-4 py-3 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-medium">
              {t("card.due")} {workOrder.scheduled_date ? formatDateShort(workOrder.scheduled_date) : t("card.noDate")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {workOrder.assignees && workOrder.assignees.length > 0 ? (
                workOrder.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {assignee.first_name?.[0]}{assignee.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                ))
              ) : workOrder.assigned_to ? (
                // Backward compatibility
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    U
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-6 w-6 border-2 border-dashed border-muted-foreground/30 bg-transparent">
                  <AvatarFallback className="text-[10px] text-muted-foreground">
                    ?
                  </AvatarFallback>
                </Avatar>
              )}
              {workOrder.assignees && workOrder.assignees.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                  +{workOrder.assignees.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {workOrder.assignees && workOrder.assignees.length > 0
                ? workOrder.assignees.length === 1
                  ? `${workOrder.assignees[0].first_name} ${workOrder.assignees[0].last_name}`
                  : t("card.multipleAssignees", { count: workOrder.assignees.length })
                : workOrder.assigned_to_name || t("card.unassigned")}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-slate-100 p-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <span className="capitalize font-medium">{t(`form.types.${workOrder.type}`)}</span>
          <span className="font-mono text-xs opacity-60">#{workOrder.id.slice(0, 6)}</span>
        </CardFooter>
      </div>
    </Card>
  );
}
