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
import { MoreHorizontal, FileText, Activity, AlertTriangle, Info, Settings2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
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
  DropdownMenuCheckboxItem,
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
  isRefetching?: boolean;
}

export function VehicleTable({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
  onCreateWorkOrder,
  onCreatePlan,
  isRefetching
}: VehicleTableProps) {
  const router = useRouter();
  const t = useTranslations("vehicles.details.table");
  const tf = useTranslations("vehicles.filters");
  const tc = useTranslations("common");
  const tVehicleTypes = useTranslations("vehicleTypes");

  const ALL_COLUMNS = [
    { id: "vehicle", label: t("headers.vehicle") },
    { id: "plate", label: t("headers.plate") },
    { id: "vin", label: t("headers.vin") },
    { id: "status", label: t("headers.status") },
    { id: "mileage", label: t("headers.mileage") },
    { id: "engineHours", label: t("headers.engineHours") },
    { id: "meterUnit", label: t("headers.meterUnit") },
    { id: "fuelType", label: t("headers.fuelType") },
    { id: "address", label: t("headers.address") },
    { id: "condition", label: t("headers.condition") },
    { id: "totalCost", label: t("headers.totalCost") },
    { id: "downtime", label: t("headers.downtime") },
    { id: "nextService", label: t("headers.nextService") },
    { id: "drivers", label: t("headers.drivers") },
    { id: "woCount", label: t("headers.woCount") },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vehicle-table-columns");
      return saved ? JSON.parse(saved) : ALL_COLUMNS.map(c => c.id);
    }
    return ALL_COLUMNS.map(c => c.id);
  });

  useEffect(() => {
    localStorage.setItem("vehicle-table-columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const toggleColumn = (id: string) => {
    setVisibleColumns(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const isVisible = (id: string) => visibleColumns.includes(id);

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
      <div className="flex items-center justify-end border-b p-2 dark:border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2">
              <Settings2 className="h-4 w-4" />
              <span className="text-xs font-medium">{tc("actions")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t("selectColumns")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_COLUMNS.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={isVisible(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-900">
            {isVisible("vehicle") && <TableHead className="font-semibold">{t("headers.vehicle")}</TableHead>}
            {isVisible("plate") && <TableHead className="font-semibold">{t("headers.plate")}</TableHead>}
            {isVisible("vin") && <TableHead className="font-semibold">{t("headers.vin")}</TableHead>}
            {isVisible("status") && <TableHead className="font-semibold">{t("headers.status")}</TableHead>}
            {isVisible("mileage") && <TableHead className="font-semibold">{t("headers.mileage")}</TableHead>}
            {isVisible("engineHours") && <TableHead className="font-semibold">{t("headers.engineHours")}</TableHead>}
            {isVisible("meterUnit") && <TableHead className="font-semibold">{t("headers.meterUnit")}</TableHead>}
            {isVisible("fuelType") && <TableHead className="font-semibold">{t("headers.fuelType")}</TableHead>}
            {isVisible("address") && <TableHead className="font-semibold">{t("headers.address")}</TableHead>}
            {isVisible("condition") && <TableHead className="font-semibold">{t("headers.condition")}</TableHead>}
            {isVisible("totalCost") && <TableHead className="font-semibold">{t("headers.totalCost")}</TableHead>}
            {isVisible("downtime") && <TableHead className="font-semibold">{t("headers.downtime")}</TableHead>}
            {isVisible("nextService") && <TableHead className="font-semibold">{t("headers.nextService")}</TableHead>}
            {isVisible("drivers") && <TableHead className="font-semibold">{t("headers.drivers")}</TableHead>}
            {isVisible("woCount") && <TableHead className="font-semibold">{t("headers.woCount")}</TableHead>}
            <TableHead className="text-right font-semibold">
              {t("headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={isRefetching ? "opacity-50 transition-opacity duration-200" : "transition-opacity duration-200"}>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              {isVisible("vehicle") && (
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="text-xs text-gray-500">
                      {vehicle.year} • {vehicle.vehicle_type ? (
                        tVehicleTypes.has(vehicle.vehicle_type.code) ? tVehicleTypes(vehicle.vehicle_type.code) : vehicle.vehicle_type.name
                      ) : vehicle.type}
                    </span>
                  </div>
                </TableCell>
              )}
              {isVisible("plate") && <TableCell>{vehicle.plate_number}</TableCell>}
              {isVisible("vin") && <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>}
              {isVisible("status") && (
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
              )}
              {isVisible("mileage") && (
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {(vehicle.current_km || 0).toLocaleString()} km
                    </span>
                  </div>
                </TableCell>
              )}
              {isVisible("engineHours") && (
                <TableCell>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {(vehicle.current_engine_hours || 0).toLocaleString()} h
                    </span>
                  </div>
                </TableCell>
              )}
              {isVisible("meterUnit") && (
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {vehicle.meter_unit}
                  </Badge>
                </TableCell>
              )}
              {isVisible("fuelType") && <TableCell>{vehicle.fuel_type}</TableCell>}
              {isVisible("address") && (
                <TableCell className="max-w-[150px] truncate" title={vehicle.address}>
                  {vehicle.address}
                </TableCell>
              )}
              {isVisible("condition") && <TableCell>{vehicle.vehicle_condition}</TableCell>}
              {isVisible("totalCost") && <TableCell>{formatCurrency(vehicle.kpis?.total_maintenance_cost || 0)}</TableCell>}
              {isVisible("downtime") && (
                <TableCell>
                  <span className="text-gray-500">
                    {t("days", { days: 0 })}
                  </span>
                </TableCell>
              )}
              {isVisible("nextService") && (
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">
                      {t("noService")}
                    </span>
                  </div>
                </TableCell>
              )}
              {isVisible("drivers") && (
                <TableCell>
                  <div className="flex items-center -space-x-3 overflow-hidden">
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
              )}
              {isVisible("woCount") && (
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    0
                  </Badge>
                </TableCell>
              )}
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
    </div >
  );
}
