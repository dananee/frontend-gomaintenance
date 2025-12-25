"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  Trash2,
  Star,
  Mail,
  Phone,
  Calendar,
  Users,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDateShort } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { VehicleDriver } from "../types/driver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VehicleDriversTabProps {
  vehicleId: string;
  drivers: VehicleDriver[];
  availableDrivers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar_url: string;
  }>;
  onAssignDrivers: (driverIds: string[], primaryDriverId?: string) => Promise<void>;
  onUnassignDriver: (driverId: string) => Promise<void>;
  onSetPrimary: (driverId: string) => Promise<void>;
  isLoading?: boolean;
}

export function VehicleDriversTab({
  vehicleId,
  drivers,
  availableDrivers,
  onAssignDrivers,
  onUnassignDriver,
  onSetPrimary,
  isLoading,
}: VehicleDriversTabProps) {
  const t = useTranslations("features.vehicles.drivers");
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [driverToRemove, setDriverToRemove] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Filter out already assigned drivers
  const unassignedDrivers = availableDrivers.filter(
    (driver) => !drivers.some((d) => d.driver_id === driver.id)
  );

  const handleAssignDrivers = async () => {
    if (selectedDriverIds.length === 0) return;

    setIsAssigning(true);
    try {
      await onAssignDrivers(selectedDriverIds);
      setSelectedDriverIds([]);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignDriver = async () => {
    if (!driverToRemove) return;

    try {
      await onUnassignDriver(driverToRemove);
      setDriverToRemove(null);
    } catch (error) {
      console.error("Failed to unassign driver:", error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white/50 p-6 dark:border-gray-800 dark:bg-slate-900/50 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* Add Driver Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[280px]">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !selectedDriverIds.includes(value)) {
                      setSelectedDriverIds((prev) => [...prev, value]);
                    }
                  }}
                >
                  <SelectTrigger className="h-11 w-full border-gray-200 bg-white shadow-sm ring-offset-white focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 dark:ring-offset-slate-950">
                    <SelectValue placeholder={t("selectDrivers")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {unassignedDrivers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {t("allDriversAssigned")}
                      </div>
                    ) : (
                      unassignedDrivers.map((driver) => (
                        <SelectItem
                          key={driver.id}
                          value={driver.id}
                          className="py-3"
                          disabled={selectedDriverIds.includes(driver.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={driver.avatar_url} />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(driver.first_name, driver.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {driver.first_name} {driver.last_name}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAssignDrivers}
                disabled={selectedDriverIds.length === 0 || isAssigning}
                className="h-11 px-8 font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {isAssigning ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {t("assignDrivers")}
              </Button>
            </div>

            {/* Selected Drivers Tags */}
            {selectedDriverIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50/50 p-3 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 pr-2 border-r border-gray-200 dark:border-gray-700 mr-1">
                  {selectedDriverIds.length} {t("driversSelected")}
                </span>
                {selectedDriverIds.map((id) => {
                  const driver = availableDrivers.find((d) => d.id === id);
                  if (!driver) return null;
                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="gap-2 px-3 py-1 text-sm bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <span>
                        {driver.first_name} {driver.last_name}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedDriverIds((prev) =>
                            prev.filter((dId) => dId !== id)
                          )
                        }
                        className="rounded-full p-0.5 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drivers List */}
      {drivers.length === 0 ? (
        <Card className="border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("noDrivers")}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              {t("noDriversDesc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drivers.map((assignment) => (
            <Card
              key={assignment.id}
              className={cn(
                "group relative overflow-hidden transition-all hover:shadow-md border-gray-200 dark:border-gray-800",
                assignment.is_primary &&
                  "border-yellow-300 dark:border-yellow-700"
              )}
            >
              <CardContent className="p-4">
                {/* Primary Badge */}
                {assignment.is_primary && (
                  <div className="absolute right-2 top-2">
                    <Badge className="gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      {t("primary")}
                    </Badge>
                  </div>
                )}

                {/* Driver Info */}
                <div className="mb-4 flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={assignment.driver.avatar_url}
                      alt={`${assignment.driver.first_name} ${assignment.driver.last_name}`}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {getInitials(
                        assignment.driver.first_name,
                        assignment.driver.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {assignment.driver.first_name}{" "}
                      {assignment.driver.last_name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{assignment.driver.email}</span>
                    </div>
                    {assignment.driver.phone && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{assignment.driver.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assignment Dates */}
                {(assignment.start_date || assignment.end_date) && (
                  <div className="mb-3 space-y-1 rounded-md bg-gray-50 p-2 dark:bg-gray-900/50">
                    {assignment.start_date && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {t("from")}: {formatDateShort(assignment.start_date)}
                        </span>
                      </div>
                    )}
                    {assignment.end_date && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {t("to")}: {formatDateShort(assignment.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 border-t pt-3 dark:border-gray-800">
                  {!assignment.is_primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onSetPrimary(assignment.driver_id)}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      {t("setPrimary")}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                    onClick={() => setDriverToRemove(assignment.driver_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Remove Driver Confirmation Dialog */}
      <AlertDialog
        open={!!driverToRemove}
        onOpenChange={() => setDriverToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("removeDriverTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("removeDriverDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassignDriver}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
