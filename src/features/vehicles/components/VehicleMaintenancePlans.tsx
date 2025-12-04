"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Calendar,
  Gauge,
} from "lucide-react";
import { VehicleMaintenancePlan } from "@/features/vehicles/api/vehiclePlans";
import { cn } from "@/lib/utils";
import { useMaintenanceMutations } from "@/features/maintenance/hooks/useMaintenanceMutations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VehicleMaintenancePlansProps {
  plans?: VehicleMaintenancePlan[];
  isLoading?: boolean;
  isDeleting?: boolean;
  onCreate: () => void;
  onEdit: (plan: VehicleMaintenancePlan) => void;
  onDelete: (planId: string) => void;
}

export function VehicleMaintenancePlans({
  plans = [],
  isLoading,
  isDeleting,
  onCreate,
  onEdit,
  onDelete,
}: VehicleMaintenancePlansProps) {
  const { runPlanNow, pausePlan, resumePlan } = useMaintenanceMutations();
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  const handleRunNow = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    runPlanNow.mutate(planId);
  };

  const handlePauseResume = (e: React.MouseEvent, plan: VehicleMaintenancePlan) => {
    e.stopPropagation();
    if (plan.is_active) {
      pausePlan.mutate(plan.id);
    } else {
      resumePlan.mutate(plan.id);
    }
  };

  const handleDelete = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this plan?")) {
      onDelete(planId);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="border-dashed border-gray-300 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RefreshCw className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No Maintenance Plans</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Set up recurring maintenance schedules to keep this vehicle in top condition.
            We&apos;ll notify you when service is due.
          </p>
          <Button onClick={onCreate} className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create First Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Active Plans</h2>
          <p className="text-sm text-muted-foreground">
            Manage recurring maintenance schedules
          </p>
        </div>
        <Button onClick={onCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      <div className="grid gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md dark:bg-gray-900/40",
              !plan.is_active && "opacity-75 bg-gray-50 dark:bg-gray-900/20"
            )}
          >
            {/* Status Indicator Strip */}
            <div
              className={cn(
                "absolute left-0 top-0 h-full w-1",
                plan.is_active ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
              )}
            />

            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(plan.id)}>
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {plan.template?.name || "Custom Plan"}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-normal capitalize", getPriorityColor(plan.priority))}
                    >
                      {plan.priority || "Medium"}
                    </Badge>
                    {!plan.is_active && (
                      <Badge variant="secondary" className="text-xs">
                        Paused
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>
                        Every {plan.interval_km ? `${plan.interval_km.toLocaleString()} km` : ""}
                        {plan.interval_km && plan.interval_months ? " or " : ""}
                        {plan.interval_months ? `${plan.interval_months} months` : ""}
                      </span>
                    </div>
                    {(plan.next_service_date || plan.next_service_km) && (
                      <div className={cn(
                        "flex items-center gap-1.5 font-medium",
                        new Date(plan.next_service_date || "") < new Date() ? "text-red-600 dark:text-red-400" : "text-primary"
                      )}>
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Due: {plan.next_service_date ? new Date(plan.next_service_date).toLocaleDateString() : "—"}
                          {plan.next_service_km ? ` or ${plan.next_service_km.toLocaleString()} km` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                          onClick={(e) => handleRunNow(e, plan.id)}
                          disabled={runPlanNow.isPending}
                        >
                          {runPlanNow.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Run Plan Now</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          onClick={(e) => handlePauseResume(e, plan)}
                          disabled={pausePlan.isPending || resumePlan.isPending}
                        >
                          {plan.is_active ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{plan.is_active ? "Pause Plan" : "Resume Plan"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                    onClick={() => toggleExpand(plan.id)}
                  >
                    {expandedPlanId === plan.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedPlanId === plan.id && (
                <div className="mt-4 border-t pt-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Service</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{plan.last_service_date ? new Date(plan.last_service_date).toLocaleDateString() : "Never"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Gauge className="h-3.5 w-3.5 text-gray-400" />
                        <span>{plan.last_service_km ? `${plan.last_service_km.toLocaleString()} km` : "0 km"}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Due</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{plan.next_service_date ? new Date(plan.next_service_date).toLocaleDateString() : "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Gauge className="h-3.5 w-3.5 text-gray-400" />
                        <span>{plan.next_service_km ? `${plan.next_service_km.toLocaleString()} km` : "—"}</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-end gap-2">
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(plan);
                        }}
                      >
                        Edit Configuration
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                        onClick={(e) => handleDelete(e, plan.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete Plan
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
