"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, DollarSign } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MaintenanceRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  mileage: number;
  cost?: number;
  status: "completed" | "cancelled";
  technician?: string;
}

interface VehicleMaintenanceHistoryProps {
  vehicleId: string;
  records?: MaintenanceRecord[];
}

export function VehicleMaintenanceHistory({
  vehicleId,
  records = [],
}: VehicleMaintenanceHistoryProps) {
  const mockRecords: MaintenanceRecord[] = records.length > 0 ? records : [
    {
      id: "1",
      type: "Oil Change",
      description: "Regular oil change and filter replacement",
      date: "2024-11-15",
      mileage: 45000,
      cost: 89.99,
      status: "completed",
      technician: "John Smith",
    },
    {
      id: "2",
      type: "Brake Inspection",
      description: "Full brake system inspection and pad replacement",
      date: "2024-10-20",
      mileage: 43500,
      cost: 320.50,
      status: "completed",
      technician: "Sarah Johnson",
    },
    {
      id: "3",
      type: "Tire Rotation",
      description: "Tire rotation and pressure check",
      date: "2024-09-10",
      mileage: 42000,
      cost: 45.00,
      status: "completed",
      technician: "Mike Davis",
    },
  ];

  if (mockRecords.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No maintenance history available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Complete maintenance history for this vehicle
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-6">
          {mockRecords.map((record, index) => (
            <div key={record.id} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-3 top-2 h-4 w-4 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-900" />

              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {record.type}
                        </h4>
                        <Badge
                          variant={
                            record.status === "completed" ? "success" : "outline"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {record.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(record.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wrench className="h-3.5 w-3.5" />
                          <span>{record.mileage.toLocaleString()} km</span>
                        </div>
                        {record.cost && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>${record.cost.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {record.technician && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Technician: {record.technician}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
