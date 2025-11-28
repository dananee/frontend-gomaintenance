"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { CostChart } from "@/features/reports/components/CostChart";
import { AvailabilityChart } from "@/features/reports/components/AvailabilityChart";
import { TrendBadge } from "@/features/dashboard/components/TrendBadge";
import { OverdueWorkOrders } from "@/features/dashboard/components/OverdueWorkOrders";
import { VehiclesNeedingMaintenance } from "@/features/dashboard/components/VehiclesNeedingMaintenance";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/vehicles">
          <Card className="transition-all hover:shadow-lg cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <TrendBadge value={3.2} label="from last month" />
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/work-orders">
          <Card className="transition-all hover:shadow-lg cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Work Orders</CardTitle>
              <Wrench className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <TrendBadge value={-15.5} label="from last week" />
            </CardContent>
          </Card>
        </Link>
        
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 dark:border-green-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Availability</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <TrendBadge value={2.1} label="from last week" />
          </CardContent>
        </Card>
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
