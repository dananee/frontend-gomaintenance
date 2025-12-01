"use client";

import { Vehicle } from "../types/vehicle.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function VehicleTable({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (vehicles.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No vehicles found</div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-semibold">Vehicle</TableHead>
              <TableHead className="font-semibold">License Plate</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Mileage</TableHead>
              <TableHead className="font-semibold">Total Maint. Cost</TableHead>
              <TableHead className="font-semibold">Downtime</TableHead>
              <TableHead className="font-semibold">Next Service</TableHead>
              <TableHead className="font-semibold">Health Score</TableHead>
              <TableHead className="font-semibold">WO Count</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle, index) => {
              // Mock KPI data - will be replaced with real API data
              const maintenanceCost = Math.floor(5000 + Math.random() * 15000);
              const downtime = Math.floor(10 + Math.random() * 50);
              const daysUntilService = Math.floor(5 + Math.random() * 90);
              const healthScore = Math.floor(60 + Math.random() * 40);
              const woCount = Math.floor(5 + Math.random() * 25);

              return (
                <TableRow
                  key={vehicle.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <TableCell className="font-medium">
                    {vehicle.year} {vehicle.brand} {vehicle.model}
                  </TableCell>
                  <TableCell>{vehicle.plate_number}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                        vehicle.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : vehicle.status === "maintenance"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(vehicle.current_km || 0).toLocaleString()} km
                  </TableCell>
                  <TableCell className="font-medium">
                    ${maintenanceCost.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className="text-orange-600 dark:text-orange-400">
                      {downtime}h
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm ${
                        daysUntilService < 15
                          ? "text-red-600 dark:text-red-400 font-medium"
                          : daysUntilService < 30
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {daysUntilService} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              healthScore >= 80
                                ? "bg-green-500"
                                : healthScore >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${healthScore}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {healthScore}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{woCount}</span>
                      {woCount > 15 ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View KPIs"
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(vehicle)}
                        title="Edit"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => onDelete(vehicle.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
