"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUpcomingMaintenance } from "@/features/reports/api/reports";

const urgencyConfig = {
  upcoming: {
    variant: "info" as const,
    color: "text-blue-600 dark:text-blue-400",
  },
  soon: {
    variant: "warning" as const,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  overdue: {
    variant: "destructive" as const,
    color: "text-red-600 dark:text-red-400",
  },
};

function VehiclesNeedingMaintenanceComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["upcoming-maintenance"],
    queryFn: getUpcomingMaintenance,
  });

  // Transform API data to match component interface
  const vehicles = useMemo(
    () =>
      data?.data?.map((item: any) => ({
        id: item.vehicle_id,
        name: item.vehicle_name || `Vehicle ${item.vehicle_id}`,
        plateNumber: item.plate_number || "N/A",
        maintenanceType: item.maintenance_type || "Scheduled Maintenance",
        dueIn: item.due_in || "Unknown",
        urgency: item.urgency || "upcoming",
      })) || [],
    [data]
  );

  const { overdueCount, soonCount } = useMemo(
    () => ({
      overdueCount: vehicles.filter((v: any) => v.urgency === "overdue").length,
      soonCount: vehicles.filter((v: any) => v.urgency === "soon").length,
    }),
    [vehicles]
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Vehicles Needing Maintenance
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            Loading...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Vehicles Needing Maintenance
          </CardTitle>
          <div className="flex gap-1">
            {overdueCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {overdueCount} overdue
              </Badge>
            )}
            {soonCount > 0 && (
              <Badge variant="warning" className="text-xs">
                {soonCount} soon
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            All vehicles are up to date
          </p>
        ) : (
          <div className="space-y-3">
            {vehicles.slice(0, 4).map((vehicle: any) => {
              const config = urgencyConfig[vehicle.urgency as keyof typeof urgencyConfig];
              return (
                <Link
                  key={vehicle.id}
                  href={`/dashboard/vehicles/${vehicle.id}`}
                  className="block"
                >
                  <div
                    className={`rounded-lg border p-3 transition-shadow hover:shadow-md ${
                      vehicle.urgency === "overdue"
                        ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20"
                        : vehicle.urgency === "soon"
                        ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20"
                        : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {vehicle.name}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {vehicle.plateNumber}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {vehicle.maintenanceType}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {vehicle.urgency === "overdue" && (
                            <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          )}
                          <p className={`text-xs font-medium ${config.color}`}>
                            Due: {vehicle.dueIn}
                          </p>
                        </div>
                      </div>
                      <Badge variant={config.variant} className="text-xs capitalize">
                        {vehicle.urgency}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const VehiclesNeedingMaintenance = memo(VehiclesNeedingMaintenanceComponent);
