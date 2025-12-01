"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getVehicleDetails } from "@/features/vehicles/api/getVehicleDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleKPICard } from "@/features/vehicles/components/VehicleKPICard";
import { ServiceSummary } from "@/features/vehicles/components/ServiceSummary";
import { CostTrendChart } from "@/features/dashboard/components/CostTrendChart";
import { DowntimeChart } from "@/features/dashboard/components/DowntimeChart";
import { WorkOrderPieChart } from "@/features/dashboard/components/WorkOrderPieChart";
import {
  ArrowLeft,
  DollarSign,
  Wrench,
  Clock,
  Timer,
  Zap,
  TrendingDown,
  Package,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicle-details", vehicleId],
    queryFn: () => getVehicleDetails(vehicleId),
    enabled: !!vehicleId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-96 items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground text-lg">Failed to load vehicle details</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const { vehicle, metrics, serviceSummary, charts, partsUsed } = data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">
              {vehicle.licensePlate} • VIN: {vehicle.vin} • {vehicle.status.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/vehicles/${vehicleId}/edit`}>
            <Button variant="outline">Edit Vehicle</Button>
          </Link>
          <Button>Create Work Order</Button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* A. Finance / Cost Metrics */}
          <VehicleKPICard
            title="Total Maintenance Cost"
            value={`$${metrics.totalMaintenanceCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            className="bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />
          <VehicleKPICard
            title="Avg Repair Cost"
            value={`$${metrics.averageRepairCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Per work order"
            icon={Wrench}
            className="bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />
          <VehicleKPICard
            title="Cost per KM"
            value={`$${metrics.costPerKm.toFixed(2)}`}
            icon={TrendingDown}
            className="bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />

          {/* B. Performance Metrics */}
          <VehicleKPICard
            title="MTBF"
            value={`${metrics.mtbf.toFixed(0)}h`}
            subtitle="Mean Time Between Failures"
            icon={Zap}
            className="bg-gradient-to-br from-[#065F46] via-[#047857] to-[#059669] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />
          <VehicleKPICard
            title="Reliability Score"
            value={`${metrics.reliabilityScore.toFixed(1)}%`}
            icon={Zap}
            className="bg-gradient-to-br from-[#065F46] via-[#047857] to-[#059669] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />

          {/* C. Risk & Downtime */}
          <VehicleKPICard
            title="Total Downtime"
            value={`${metrics.totalDowntimeHours.toFixed(1)}h`}
            icon={Clock}
            className="bg-gradient-to-br from-[#7F1D1D] via-[#B91C1C] to-[#DC2626] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />
          <VehicleKPICard
            title="MTTR"
            value={`${metrics.mttr.toFixed(1)}h`}
            subtitle="Mean Time To Repair"
            icon={Timer}
            className="bg-gradient-to-br from-[#7F1D1D] via-[#B91C1C] to-[#DC2626] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />

          {/* D. General Info */}
          <VehicleKPICard
            title="Work Orders"
            value={metrics.totalWorkOrders}
            subtitle="Total completed"
            icon={Wrench}
            className="bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#475569] text-white shadow-lg/20 hover:scale-[1.01] transition-transform duration-200"
            iconClassName="text-white/80"
          />
        </div>
      </div>

      {/* Service Summary */}
      <ServiceSummary
        lastMaintenanceDate={serviceSummary.lastMaintenanceDate || ""}
        lastMaintenanceCost={serviceSummary.lastMaintenanceCost}
        nextServiceDue={serviceSummary.nextServiceDue || ""}
        lastTechnician={serviceSummary.lastTechnicianName}
        serviceInterval={serviceSummary.serviceInterval}
      />

      {/* Charts Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <CostTrendChart
            data={(charts.maintenanceCostTrend || []).map((item) => ({
              month: item.date,
              value: item.value,
              label: `$${item.value.toFixed(0)}`,
            }))}
          />
          <DowntimeChart
            data={(charts.downtimeTrend || []).map((item) => ({
              month: item.date,
              value: item.value,
              label: `${item.value.toFixed(0)}h`,
            }))}
          />
          <WorkOrderPieChart
            data={(charts.workOrderDistribution || []).map((item) => ({
              status: item.name,
              count: item.value,
              percentage: metrics.totalWorkOrders > 0 ? (item.value / metrics.totalWorkOrders) * 100 : 0,
              color:
                item.name === "preventive"
                  ? "#10b981"
                  : item.name === "corrective"
                  ? "#f59e0b"
                  : item.name === "breakdown"
                  ? "#ef4444"
                  : "#3b82f6",
            }))}
          />
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">
                Mileage Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[240px] items-center justify-center text-muted-foreground">
                {(charts.mileageGrowth || []).length > 0 ? (
                    <p>Chart data available</p> // Placeholder for actual chart if implemented later
                ) : (
                    <p>No mileage history available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Parts Used & Costs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Parts Used & Costs</h2>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-semibold">Part Name</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Cost</TableHead>
                    <TableHead className="font-semibold">Date Used</TableHead>
                    <TableHead className="font-semibold">Work Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(partsUsed || []).length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No parts used yet
                        </TableCell>
                    </TableRow>
                  ) : (
                    partsUsed.map((part, index) => (
                        <TableRow
                        key={index}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                        >
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            {part.partName}
                            </div>
                        </TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell className="font-medium">
                            ${part.cost.toLocaleString()}
                        </TableCell>
                        <TableCell>
                            {new Date(part.dateUsed).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            <Link
                            href={`/dashboard/work-orders/${part.workOrderId}`}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                            View Work Order
                            </Link>
                        </TableCell>
                        </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
