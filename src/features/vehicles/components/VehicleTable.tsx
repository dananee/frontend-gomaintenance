"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Activity, AlertTriangle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { useTranslations } from "next-intl";
import { TableSkeleton } from "@/components/ui/skeleton";

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onCreateWorkOrder: (vehicle: Vehicle) => void;
  onCreatePlan: (vehicle: Vehicle) => void;
}

export function VehicleTable({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
  onCreateWorkOrder,
  onCreatePlan
}: VehicleTableProps) {
  const router = useRouter();
  const t = useTranslations("vehicles.details.table");
  const tf = useTranslations("vehicles.filters");
  const tc = useTranslations("common");

  if (isLoading) {
    return <TableSkeleton rows={8} />;
  }

  if (!vehicles?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
          <FileText className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t("noData")}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("noData")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-900">
            <TableHead className="font-semibold">{t("headers.vehicle")}</TableHead>
            <TableHead className="font-semibold">{t("headers.plate")}</TableHead>
            <TableHead className="font-semibold">{t("headers.status")}</TableHead>
            <TableHead className="font-semibold">{t("headers.mileage")}</TableHead>
            <TableHead className="font-semibold">{t("headers.totalCost")}</TableHead>
            <TableHead className="font-semibold">{t("headers.downtime")}</TableHead>
            <TableHead className="font-semibold">{t("headers.nextService")}</TableHead>
            <TableHead className="font-semibold">{t("headers.drivers")}</TableHead>
            <TableHead className="font-semibold">{t("headers.woCount")}</TableHead>
            <TableHead className="text-right font-semibold">
              {t("headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {vehicle.brand} {vehicle.model}
                  </span>
                  <span className="text-xs text-gray-500">
                    {vehicle.year} • {tf.has(`type.${vehicle.type}`) ? tf(`type.${vehicle.type}`) : vehicle.type}
                  </span>
                </div>
              </TableCell>
              <TableCell>{vehicle.plate_number}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${vehicle.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : vehicle.status === "maintenance"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                >
                  {tf(`status.${vehicle.status}`) || vehicle.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-gray-400" />
                  <span>
                    {(vehicle.current_km || 0).toLocaleString()} km
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(vehicle.kpis?.total_maintenance_cost || 0)}</TableCell>
              <TableCell>
                <span className="text-gray-500">
                  {t("days", { days: 0 })}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">
                    {t("noService")}
                  </span>
                </div>
              </TableCell>
              <TableCell>

                <div className="flex items-center -space-x-3 overflow-hidden">
                  {/* Render first 3 drivers */}
                  {vehicle.drivers && vehicle.drivers.length > 0 ? (
                    <>
                      {vehicle.drivers.slice(0, 3).map((driver) => (
                        <TooltipProvider key={driver.id}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900">
                                <AvatarImage src={driver.avatar_url} />
                                <AvatarFallback>
                                  {driver.first_name[0]}
                                  {driver.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {driver.first_name} {driver.last_name}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}

                      {/* Render Overflow Counter */}
                      {vehicle.drivers.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white dark:bg-slate-800 dark:ring-slate-900 z-10">
                          <span className="text-xs font-medium text-slate-500">
                            +{vehicle.drivers.length - 3}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  0
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">{tc("openMenu")}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("headers.actions")}</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}
                    >
                      {t("viewDetails")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit(vehicle)}
                    >
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onCreateWorkOrder(vehicle)}
                    >
                      {t("createWorkOrder")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onCreatePlan(vehicle)}
                    >
                      {t("scheduleService")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(vehicle.id)}
                    >
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
