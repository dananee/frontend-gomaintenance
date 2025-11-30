"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { CostChart } from "@/features/reports/components/CostChart";
import { AvailabilityChart } from "@/features/reports/components/AvailabilityChart";
import { TrendBadge } from "@/features/dashboard/components/TrendBadge";
import { OverdueWorkOrders } from "@/features/dashboard/components/OverdueWorkOrders";
import { VehiclesNeedingMaintenance } from "@/features/dashboard/components/VehiclesNeedingMaintenance";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "@/features/vehicles/api/getVehicles";
import { getWorkOrders } from "@/features/workOrders/api/getWorkOrders";
import { getFleetAvailability } from "@/features/reports/api/reports";

export default function DashboardPage() {
  // Fetch vehicles data
  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles({ page: 1, page_size: 1000 }),
  });

  // Fetch work orders data
  const { data: workOrdersData } = useQuery({
    queryKey: ["work-orders", "active"],
    queryFn: () =>
      getWorkOrders({
        status: "in_progress",
        page: 1,
        page_size: 1000,
      }),
  });

  // Fetch critical work orders (urgent priority)
  const { data: criticalWorkOrdersData } = useQuery({
    queryKey: ["work-orders", "critical"],
    queryFn: () =>
      getWorkOrders({
        status: "pending",
        page: 1,
        page_size: 1000,
      }),
  });

  // Fetch fleet availability
  const { data: fleetAvailabilityData } = useQuery({
    queryKey: ["fleet-availability"],
    queryFn: getFleetAvailability,
  });

  const totalVehicles = vehiclesData?.total || 0;
  const activeWorkOrders = workOrdersData?.total || 0;
  const criticalIssues =
    criticalWorkOrdersData?.data?.filter((wo) => wo.priority === "urgent")
      .length || 0;
  const fleetAvailability = fleetAvailabilityData?.availability_percent || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/vehicles">
          <Card className="group cursor-pointer border-blue-200 transition-all hover:border-blue-400 hover:shadow-lg dark:border-blue-900/50 dark:hover:border-blue-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Vehicles
              </CardTitle>
              <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {totalVehicles}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Active fleet vehicles
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/work-orders">
          <Card className="group cursor-pointer border-orange-200 transition-all hover:border-orange-400 hover:shadow-lg dark:border-orange-900/50 dark:hover:border-orange-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Work Orders
              </CardTitle>
              <div className="rounded-lg bg-orange-100 p-2 transition-colors group-hover:bg-orange-200 dark:bg-orange-900/30 dark:group-hover:bg-orange-900/50">
                <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {activeWorkOrders}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                In progress
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/maintenance">
          <Card className="group cursor-pointer border-red-200 transition-all hover:border-red-400 hover:shadow-lg dark:border-red-900/50 dark:hover:border-red-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Critical Issues
              </CardTitle>
              <div className="rounded-lg bg-red-100 p-2 transition-colors group-hover:bg-red-200 dark:bg-red-900/30 dark:group-hover:bg-red-900/50">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {criticalIssues}
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reports">
          <Card className="group cursor-pointer border-green-200 transition-all hover:border-green-400 hover:shadow-lg dark:border-green-900/50 dark:hover:border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fleet Availability
              </CardTitle>
              <div className="rounded-lg bg-green-100 p-2 transition-colors group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {fleetAvailability.toFixed(0)}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Vehicles available
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Widgets Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <OverdueWorkOrders />
        <VehiclesNeedingMaintenance />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <CostChart />
        </div>
        <div className="col-span-3">
          <AvailabilityChart />
        </div>
      </div>
    </div>
  );
}
