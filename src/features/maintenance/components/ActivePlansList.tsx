"use client";

import { useTranslations } from "next-intl";
import { formatDateShort } from "@/lib/formatters";

import { ActiveMaintenancePlan } from "../types/maintenanceDashboard.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Calendar,
  Gauge,
  Truck,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClipboardList } from "lucide-react";

interface ActivePlansListProps {
  plans: ActiveMaintenancePlan[];
  isLoading?: boolean;
}

export function ActivePlansList({ plans, isLoading }: ActivePlansListProps) {
  const t = useTranslations("maintenance.dashboard");
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[200px] animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title={t("noActivePlans")}
        description={t("emptyDescription")}
        actionLabel={t("viewVehicles")}
        onAction={() => (window.location.href = "/dashboard/vehicles")}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => {
        // Safety check for vehicle data
        if (!plan.vehicle || !plan.template) {
          console.warn("Invalid plan data:", plan);
          return null;
        }

        return (
          <Card
            key={plan.id}
            className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                  >
                    {plan.vehicle.type || "N/A"}
                  </Badge>
                  <span className="text-xs text-gray-500 font-mono">
                    {plan.vehicle.plate_number || "N/A"}
                  </span>
                </div>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {plan.vehicle.brand || ""} {plan.vehicle.model || ""}
                </CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>{t("viewDetails")}</DropdownMenuItem>
                  <DropdownMenuItem>{t("editPlan")}</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    {t("deactivate")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t("template")}
                </h4>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {plan.template.name || "Unknown Template"}
                </p>
              </div>

              <div className="space-y-3">
                {/* Next Due Date */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{t("nextDue")}</span>
                  </div>
                  <span
                    className={
                      plan.next_due_date &&
                        new Date(plan.next_due_date) < new Date()
                        ? "text-red-600 font-medium"
                        : "text-gray-900 dark:text-white font-medium"
                    }
                  >
                    {plan.next_due_date
                      ? formatDateShort(plan.next_due_date)
                      : t("notScheduled")}
                  </span>
                </div>

                {/* Next Due Mileage */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Gauge className="h-4 w-4" />
                    <span>{t("dueAtKm")}</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {plan.next_due_mileage?.toLocaleString() || "N/A"}
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                  {plan.is_active ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {plan.is_active
                      ? t("activeStatus")
                      : t("attentionStatus")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
