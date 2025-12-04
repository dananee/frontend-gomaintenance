"use client";

import { useEffect } from "react";
import { X, Calendar, User, DollarSign, FileText, AlertCircle, Trash2, CheckCircle, ExternalLink, Clock, Tag, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMaintenanceMutations } from "../hooks/useMaintenanceMutations";
import { getStatusColor, getPriorityColor, formatStatus, formatPriority } from "../utils/colorMappings";
import { formatDateTime } from "../utils/dateFormatters";
import { useRouter } from "next/navigation";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";
import { toast } from "sonner";

interface EventDrawerProps {
  event: ScheduledMaintenanceEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDrawer({ event, isOpen, onClose }: EventDrawerProps) {
  const router = useRouter();
  const { deleteEvent, markEventDone, convertToWorkOrder } = useMaintenanceMutations();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDelete = () => {
    if (event && confirm("⚠️ Are you sure you want to delete this maintenance event? This action cannot be undone.")) {
      deleteEvent.mutate(event.id, {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleMarkDone = () => {
    if (event && confirm("✅ Mark this maintenance as completed?")) {
      markEventDone.mutate(event.id, {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleConvertToWorkOrder = () => {
    if (event) {
      convertToWorkOrder.mutate(event.id, {
        onSuccess: (data) => {
          onClose();
          if (data.work_order?.id) {
            router.push(`/dashboard/work-orders/${data.work_order.id}`);
          }
        },
      });
    }
  };

  const isHighPriority = event?.priority === "high" || event?.priority === "critical";

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in-0 duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-gray-200 dark:border-gray-800",
          "animate-in slide-in-from-right duration-300"
        )}
      >
        {/* Header with gradient */}
        <div className={cn(
          "flex items-center justify-between border-b p-5",
          isHighPriority 
            ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800"
            : "bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50 border-gray-200 dark:border-gray-800"
        )}>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Event Details
            </h2>
            {isHighPriority && (
              <Badge variant="outline" className="bg-red-500 text-white border-red-600 animate-pulse-subtle">
                High Priority
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-180px)] overflow-y-auto p-6 scrollbar-hide">
          {event ? (
            <div className="space-y-6">
              {/* Title & Status */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-medium px-3 py-1", getStatusColor(event.status))}
                  >
                    <Tag className="h-3 w-3 mr-1.5" />
                    {formatStatus(event.status)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-medium px-3 py-1", getPriorityColor(event.priority))}
                  >
                    {formatPriority(event.priority)}
                  </Badge>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Data Rows with Icons */}
              <div className="space-y-4">
                {/* Vehicle */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Equipment
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {event.vehicle_name}
                    </p>
                  </div>
                </div>

                {/* Scheduled Date */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Scheduled Date
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDateTime(event.scheduled_date)}
                    </p>
                  </div>
                </div>

                {/* Assigned Technician */}
                {event.assigned_to && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Assigned Technician
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {event.assigned_to}
                      </p>
                    </div>
                  </div>
                )}

                {/* Estimated Cost */}
                {event.estimated_cost && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Estimated Cost
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${event.estimated_cost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <FileText className="h-4 w-4" />
                      <span>Description</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {event.notes && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <FileText className="h-4 w-4" />
                      <span>Notes</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {event.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Event not found</p>
                <p className="text-xs text-gray-500 mt-1">
                  This event may have been deleted or you don't have permission to view it.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Premium Action Buttons */}
        {event && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-5 dark:border-gray-800">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Implement edit modal
                  toast.info("Edit functionality coming soon");
                }}
                className="w-full h-10 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkDone}
                disabled={event.status === "completed"}
                className="w-full h-10 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Done
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToWorkOrder}
                disabled={!!event.work_order_id}
                className="w-full h-10 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {event.work_order_id ? "View WO" : "WO"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="w-full col-span-3 h-10 bg-red-500 hover:bg-red-600 text-white border-0 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-red-500/50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
