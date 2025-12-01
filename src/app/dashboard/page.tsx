"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
  Wrench,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  Timer,
  Zap,
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  Shield,
  Users,
  CheckCircle2,
  Gauge,
} from "lucide-react";
import { Suspense, lazy } from "react";
import { TrendBadge } from "@/features/dashboard/components/TrendBadge";
import { OverdueWorkOrders } from "@/features/dashboard/components/OverdueWorkOrders";
import { VehiclesNeedingMaintenance } from "@/features/dashboard/components/VehiclesNeedingMaintenance";
import { DashboardKPICard } from "@/features/dashboard/components/DashboardKPICard";

// Lazy load charts
const CostChart = lazy(() => import("@/features/reports/components/CostChart").then(module => ({ default: module.CostChart })));
const AvailabilityChart = lazy(() => import("@/features/reports/components/AvailabilityChart").then(module => ({ default: module.AvailabilityChart })));
const CostTrendChart = lazy(() => import("@/features/dashboard/components/CostTrendChart").then(module => ({ default: module.CostTrendChart })));
const DowntimeChart = lazy(() => import("@/features/dashboard/components/DowntimeChart").then(module => ({ default: module.DowntimeChart })));
const WorkOrderPieChart = lazy(() => import("@/features/dashboard/components/WorkOrderPieChart").then(module => ({ default: module.WorkOrderPieChart })));
const FleetHealthScore = lazy(() => import("@/features/dashboard/components/FleetHealthScore").then(module => ({ default: module.FleetHealthScore })));
const TopFaultTypesChart = lazy(() => import("@/features/dashboard/components/TopFaultTypesChart").then(module => ({ default: module.TopFaultTypesChart })));
const TechnicianPerformanceChart = lazy(() => import("@/features/dashboard/components/TechnicianPerformanceChart").then(module => ({ default: module.TechnicianPerformanceChart })));
const SLAComplianceChart = lazy(() => import("@/features/dashboard/components/SLAComplianceChart").then(module => ({ default: module.SLAComplianceChart })));
const MTTRTrendChart = lazy(() => import("@/features/dashboard/components/MTTRTrendChart").then(module => ({ default: module.MTTRTrendChart })));
const CostForecastChart = lazy(() => import("@/features/dashboard/components/CostForecastChart").then(module => ({ default: module.CostForecastChart })));
const WorkloadHeatmap = lazy(() => import("@/features/dashboard/components/WorkloadHeatmap").then(module => ({ default: module.WorkloadHeatmap })));
const FailurePredictionWidget = lazy(() => import("@/features/dashboard/components/FailurePredictionWidget").then(module => ({ default: module.FailurePredictionWidget })));
import { useDashboardKPIs } from "@/features/dashboard/hooks/useDashboardKPIs";
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

  // Fetch dashboard KPIs
  const { data: kpiData } = useDashboardKPIs();

  const totalVehicles = vehiclesData?.total || 0;
  const activeWorkOrders = workOrdersData?.total || 0;
  const criticalIssues =
    criticalWorkOrdersData?.data?.filter((wo) => wo.priority === "urgent")
      .length || 0;
  const fleetAvailability = fleetAvailabilityData?.availability_percent || 0;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Fleet KPIs */}
      {kpiData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Financial KPIs - Purple/Blue Gradient */}
          <DashboardKPICard
            title="Total Fleet Value"
            value={`$${(kpiData.fleet_kpis.total_fleet_value / 1000).toFixed(
              0
            )}K`}
            subtitle="Total asset value"
            icon={DollarSign}
            colorScheme="purple"
            href="/dashboard/vehicles"
          />
          <DashboardKPICard
            title="Maintenance Cost YTD"
            value={`$${(
              kpiData.fleet_kpis.total_maintenance_cost_ytd / 1000
            ).toFixed(0)}K`}
            subtitle="Year to date"
            icon={Wrench}
            colorScheme="purple"
            trend={kpiData.fleet_kpis.total_maintenance_cost_ytd_trend}
            href="/dashboard/reports?type=cost"
          />
          <DashboardKPICard
            title="Total Cost of Ownership"
            value={`$${(
              kpiData.fleet_kpis.total_cost_of_ownership / 1000
            ).toFixed(0)}K`}
            subtitle="Fleet TCO"
            icon={DollarSign}
            colorScheme="purple"
            href="/dashboard/reports?type=tco"
          />

          {/* Performance KPIs - Green/Blue Gradient */}
          <DashboardKPICard
            title="Fleet Efficiency"
            value={`${kpiData.fleet_kpis.fleet_efficiency_score}%`}
            subtitle="Overall performance"
            icon={Activity}
            colorScheme="green"
            trend={kpiData.fleet_kpis.fleet_efficiency_trend}
          />
          <DashboardKPICard
            title="Scheduled vs Corrective"
            value={`${kpiData.fleet_kpis.scheduled_vs_corrective_ratio.toFixed(
              1
            )}:1`}
            subtitle="Maintenance ratio"
            icon={BarChart3}
            colorScheme="green"
            trend={kpiData.fleet_kpis.scheduled_vs_corrective_trend}
          />

          {/* Risk KPIs - Orange/Red Gradient */}
          <DashboardKPICard
            title="Downtime (Month)"
            value={`${kpiData.fleet_kpis.total_downtime_hours_month}h`}
            subtitle="Total hours"
            icon={Clock}
            colorScheme="orange"
            trend={kpiData.fleet_kpis.total_downtime_hours_month_trend}
            href="/dashboard/vehicles?status=maintenance"
          />
          <DashboardKPICard
            title="Avg Downtime / Vehicle"
            value={`${kpiData.fleet_kpis.avg_downtime_per_vehicle.toFixed(1)}h`}
            subtitle="Per vehicle"
            icon={Clock}
            colorScheme="orange"
            trend={kpiData.fleet_kpis.avg_downtime_per_vehicle_trend}
          />

          {/* Availability KPIs - Cyan/Blue Gradient */}
          <DashboardKPICard
            title="MTTR"
            value={`${kpiData.fleet_kpis.fleet_mttr}h`}
            subtitle="Mean Time To Repair"
            icon={Timer}
            colorScheme="cyan"
          />
          <DashboardKPICard
            title="MTBF"
            value={`${kpiData.fleet_kpis.fleet_mtbf}h`}
            subtitle="Between failures"
            icon={Zap}
            colorScheme="cyan"
          />
          <DashboardKPICard
            title="Avg Cost / Vehicle"
            value={`$${kpiData.fleet_kpis.avg_maintenance_cost_per_vehicle.toLocaleString()}`}
            subtitle="Per vehicle"
            icon={TrendingUp}
            colorScheme="cyan"
            trend={kpiData.fleet_kpis.avg_cost_per_vehicle_trend}
          />

          {/* Additional Premium KPIs - Row 2 */}
          <DashboardKPICard
            title="WO SLA Compliance"
            value={`${kpiData.fleet_kpis.work_order_sla_compliance.toFixed(
              1
            )}%`}
            subtitle="On-time completion"
            icon={Target}
            colorScheme="green"
            trend={kpiData.fleet_kpis.work_order_sla_compliance_trend}
            href="/dashboard/work-orders?filter=sla"
          />
          <DashboardKPICard
            title="Fleet Health Score"
            value={`${kpiData.fleet_kpis.global_fleet_health_score}%`}
            subtitle="Overall fleet status"
            icon={Shield}
            colorScheme="blue"
            trend={kpiData.fleet_kpis.global_fleet_health_trend}
            href="/dashboard/vehicles?view=health"
          />
          <DashboardKPICard
            title="WO Completion Rate"
            value={`${kpiData.fleet_kpis.work_order_completion_rate_week.toFixed(
              1
            )}%`}
            subtitle="This week"
            icon={CheckCircle2}
            colorScheme="green"
            trend={kpiData.fleet_kpis.work_order_completion_rate_trend}
            href="/dashboard/work-orders"
          />
          <DashboardKPICard
            title="PM Compliance"
            value={`${kpiData.fleet_kpis.preventive_maintenance_compliance.toFixed(
              1
            )}%`}
            subtitle="Preventive maintenance"
            icon={Gauge}
            colorScheme="purple"
            trend={kpiData.fleet_kpis.preventive_maintenance_compliance_trend}
            href="/dashboard/maintenance?type=preventive"
          />
        </div>
      )}

      {/* Section Divider with Gradient */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text px-4 text-sm font-semibold text-transparent">
            Fleet Analytics
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-6 md:grid-cols-2">
        <OverdueWorkOrders />
        <VehiclesNeedingMaintenance />
      </div>

      {/* Charts Grid */}
      {kpiData && (
        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 content-visibility-auto">
            <div className="lg:col-span-2">
              <CostTrendChart data={kpiData.cost_trend_12months} />
            </div>
            <div>
              <FleetHealthScore data={kpiData.fleet_health} />
            </div>
            <div className="lg:col-span-2">
              <DowntimeChart data={kpiData.downtime_trend_12months} />
            </div>
            <div>
              <WorkOrderPieChart data={kpiData.work_order_distribution} />
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6 content-visibility-auto">
            <div>
              <TopFaultTypesChart data={kpiData.top_fault_types} />
            </div>
            <div>
              <SLAComplianceChart
                onTime={kpiData.sla_compliance.onTime}
                delayed={kpiData.sla_compliance.delayed}
                breached={kpiData.sla_compliance.breached}
                totalWOs={kpiData.sla_compliance.totalWOs}
              />
            </div>
            <div>
              <TechnicianPerformanceChart
                data={kpiData.technician_performance}
              />
            </div>
          </div>

          {/* Section Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text px-4 text-sm font-semibold text-transparent">
                Predictive Analytics & AI Insights
              </span>
            </div>
          </div>

          {/* Predictive Analytics Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 content-visibility-auto">
            <div>
              <MTTRTrendChart data={kpiData.mttr_trend} />
            </div>
            <div>
              <CostForecastChart data={kpiData.cost_forecast} />
            </div>
            <div>
              <FailurePredictionWidget
                predictions={kpiData.failure_predictions}
              />
            </div>
          </div>

          {/* Workload Analysis - Full Width */}
          <div className="mt-6 content-visibility-auto">
            <WorkloadHeatmap data={kpiData.workload_heatmap} />
          </div>
        </Suspense>
      )}

      {/* Original Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 content-visibility-auto">
        <div className="col-span-4">
          <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />}>
            <CostChart />
          </Suspense>
        </div>
        <div className="col-span-3">
          <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />}>
            <AvailabilityChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
