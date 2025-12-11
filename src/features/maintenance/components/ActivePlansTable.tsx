"use client";

import { useTranslations } from "next-intl";
import { formatDateShort } from "@/lib/formatters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveMaintenancePlan } from "../types/maintenanceDashboard.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Play,
  Pause,
  ExternalLink,
  Trash2,
  Calendar,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor, getRecurrenceColor } from "../utils/colorMappings";
import { useMaintenanceMutations } from "../hooks/useMaintenanceMutations";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClipboardList } from "lucide-react";

interface ActivePlansTableProps {
  plans: ActiveMaintenancePlan[];
  isLoading?: boolean;
}

export function ActivePlansTable({ plans, isLoading }: ActivePlansTableProps) {
  const t = useTranslations("features.maintenance.table");
  const tDashboard = useTranslations("features.maintenance.dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();
  const { runPlanNow, pausePlan, resumePlan, deletePlan } = useMaintenanceMutations();

  // Filter plans based on search
  const filteredPlans = plans.filter((plan) => {
    if (!plan.vehicle || !plan.template) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      plan.vehicle.plate_number?.toLowerCase().includes(searchLower) ||
      plan.vehicle.brand?.toLowerCase().includes(searchLower) ||
      plan.vehicle.model?.toLowerCase().includes(searchLower) ||
      plan.template.name?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

  const handleRunNow = (planId: string) => {
    runPlanNow.mutate(planId);
  };

  const handlePauseResume = (plan: ActiveMaintenancePlan) => {
    if (plan.is_active) {
      pausePlan.mutate(plan.id);
    } else {
      resumePlan.mutate(plan.id);
    }
  };

  const handleDelete = (planId: string) => {
    if (confirm(t("actions.confirmDelete"))) {
      deletePlan.mutate(planId);
    }
  };

  const getRecurrenceType = (plan: ActiveMaintenancePlan): string => {
    const template = plan.template;
    if (template.interval_days) {
      if (template.interval_days === 1) return t("recurrence.daily");
      if (template.interval_days === 7) return t("recurrence.weekly");
      if (template.interval_days === 30) return t("recurrence.monthly");
      return t("recurrence.everyDays", { days: template.interval_days });
    }
    if (template.interval_km) {
      return t("recurrence.everyKm", { km: template.interval_km });
    }
    if (template.interval_hours) {
      return t("recurrence.everyHours", { hours: template.interval_hours });
    }
    return t("recurrence.custom");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title={tDashboard("noActivePlans")}
        description={tDashboard("emptyDescription")}
        actionLabel={tDashboard("viewVehicles")}
        onAction={() => router.push("/dashboard/vehicles")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredPlans.length} {filteredPlans.length === 1 ? t("plan") : t("plans")}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("headers.asset")}</TableHead>
              <TableHead>{t("headers.planName")}</TableHead>
              <TableHead>{t("headers.recurrence")}</TableHead>
              <TableHead>{t("headers.nextDue")}</TableHead>
              <TableHead>{t("headers.status")}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {t("noPlansFound")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedPlans.map((plan) => (
                <TableRow key={plan.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {plan.vehicle.brand} {plan.vehicle.model}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {plan.vehicle.plate_number}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {plan.template.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getRecurrenceColor(getRecurrenceType(plan)))}
                    >
                      {getRecurrenceType(plan)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {plan.next_due_date && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span
                            className={cn(
                              "font-medium",
                              new Date(plan.next_due_date) < new Date()
                                ? "text-red-600"
                                : "text-gray-900 dark:text-white"
                            )}
                          >
                            {formatDateShort(plan.next_due_date)}
                          </span>
                        </div>
                      )}
                      {plan.next_due_mileage && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Gauge className="h-3 w-3" />
                          <span>{plan.next_due_mileage.toLocaleString()} km</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", plan.is_active ? getStatusColor("active") : getStatusColor("inactive"))}
                    >
                      {plan.is_active ? t("status.active") : t("status.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRunNow(plan.id)}
                          disabled={runPlanNow.isPending}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {t("actions.runNow")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePauseResume(plan)}
                          disabled={pausePlan.isPending || resumePlan.isPending}
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          {plan.is_active ? t("actions.pause") : t("actions.resume")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/vehicles/${plan.vehicle_id}`)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t("actions.viewVehicle")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600"
                          disabled={deletePlan.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {t("pagination.showing")} {startIndex + 1} {t("pagination.to")} {Math.min(startIndex + itemsPerPage, filteredPlans.length)}{" "}
            {t("pagination.of")} {filteredPlans.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {t("pagination.previous")}
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {t("pagination.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
