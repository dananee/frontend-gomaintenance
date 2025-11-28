"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertCircle } from "lucide-react";
import Link from "next/link";

interface VehicleMaintenanceNeeded {
  id: string;
  name: string;
  plateNumber: string;
  maintenanceType: string;
  dueIn: string;
  urgency: "upcoming" | "soon" | "overdue";
}

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

export function VehiclesNeedingMaintenance() {
  // Mock data - replace with API call
  const vehicles: VehicleMaintenanceNeeded[] = [
    {
      id: "V-001",
      name: "2020 Ford F-150",
      plateNumber: "ABC-123",
      maintenanceType: "Oil Change",
      dueIn: "Overdue",
      urgency: "overdue",
    },
    {
      id: "V-012",
      name: "2019 Honda Civic",
      plateNumber: "XYZ-789",
      maintenanceType: "Brake Inspection",
      dueIn: "2 days",
      urgency: "soon",
    },
    {
      id: "V-024",
      name: "2021 Toyota Camry",
      plateNumber: "DEF-456",
      maintenanceType: "Tire Rotation",
      dueIn: "500 km",
      urgency: "upcoming",
    },
    {
      id: "V-018",
      name: "2022 Chevrolet Silverado",
      plateNumber: "GHI-321",
      maintenanceType: "Filter Replacement",
      dueIn: "1 week",
      urgency: "upcoming",
    },
  ];

  const overdueCount = vehicles.filter((v) => v.urgency === "overdue").length;
  const soonCount = vehicles.filter((v) => v.urgency === "soon").length;

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
            {vehicles.map((vehicle) => {
              const config = urgencyConfig[vehicle.urgency];
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
