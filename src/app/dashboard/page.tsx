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
import { PremiumMetricCard } from "@/components/ui/premium-metric-card";

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
import { getScheduledMaintenance } from "@/features/maintenance/api/maintenanceDashboard";

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

  // Fetch critical maintenance events
  const { data: criticalMaintenanceData } = useQuery({
    queryKey: ["maintenance", "critical"],
    queryFn: () => getScheduledMaintenance({}),
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

  // Count critical issues from both work orders and maintenance events
  const urgentWorkOrders = criticalWorkOrdersData?.data?.filter((wo) => wo.priority === "urgent").length || 0;
  const criticalMaintenanceEvents = criticalMaintenanceData?.filter(
    (event) => event.priority === "critical" || event.priority === "high"
  ).length || 0;
  const criticalIssues = urgentWorkOrders + criticalMaintenanceEvents;

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
          <Link href="/dashboard/vehicles">
            <PremiumMetricCard
              title="Total Fleet Value"
              value={`$${(kpiData.fleet_kpis.total_fleet_value / 1000).toFixed(
                0
              )}K`}
              subtitle="Total asset value"
              icon={DollarSign}
              variant="purple"
            />
          </Link>
          <Link href="/dashboard/reports?type=cost">
            <PremiumMetricCard
              title="Maintenance Cost YTD"
              value={`$${(
                kpiData.fleet_kpis.total_maintenance_cost_ytd / 1000
              ).toFixed(0)}K`}
              subtitle="Year to date"
              icon={Wrench}
              variant="purple"
              trend={kpiData.fleet_kpis.total_maintenance_cost_ytd_trend}
            />
          </Link>
          <Link href="/dashboard/reports?type=tco">
            <PremiumMetricCard
              title="Total Cost of Ownership"
              value={`$${(
                kpiData.fleet_kpis.total_cost_of_ownership / 1000
              ).toFixed(0)}K`}
              subtitle="Fleet TCO"
              icon={DollarSign}
              variant="purple"
            />
          </Link>

          {/* Performance KPIs - Green/Blue Gradient */}
          <PremiumMetricCard
            title="Fleet Efficiency"
            value={`${kpiData.fleet_kpis.fleet_efficiency_score}%`}
            subtitle="Overall performance"
            icon={Activity}
            variant="green"
            trend={kpiData.fleet_kpis.fleet_efficiency_trend}
          />
          <PremiumMetricCard
            title="Scheduled vs Corrective"
            value={`${kpiData.fleet_kpis.scheduled_vs_corrective_ratio.toFixed(
              1
            )}:1`}
            subtitle="Maintenance ratio"
            icon={BarChart3}
            variant="green"
            trend={kpiData.fleet_kpis.scheduled_vs_corrective_trend}
          />

          {/* Risk KPIs - Orange/Red Gradient */}
          <Link href="/dashboard/vehicles?status=maintenance">
            <PremiumMetricCard
              title="Downtime (Month)"
              value={`${kpiData.fleet_kpis.total_downtime_hours_month}h`}
              subtitle="Total hours"
              icon={Clock}
              variant="orange"
              trend={kpiData.fleet_kpis.total_downtime_hours_month_trend}
            />
          </Link>
          <PremiumMetricCard
            title="Avg Downtime / Vehicle"
            value={`${kpiData.fleet_kpis.avg_downtime_per_vehicle.toFixed(1)}h`}
            subtitle="Per vehicle"
            icon={Clock}
            variant="orange"
            trend={kpiData.fleet_kpis.avg_downtime_per_vehicle_trend}
          />

          {/* Availability KPIs - Cyan/Blue Gradient */}
          <PremiumMetricCard
            title="MTTR"
            value={`${kpiData.fleet_kpis.fleet_mttr}h`}
            subtitle="Mean Time To Repair"
            icon={Timer}
            variant="teal"
          />
          <PremiumMetricCard
            title="MTBF"
            value={`${kpiData.fleet_kpis.fleet_mtbf}h`}
            subtitle="Between failures"
            icon={Zap}
            variant="teal"
          />
          <PremiumMetricCard
            title="Avg Cost / Vehicle"
            value={`$${kpiData.fleet_kpis.avg_maintenance_cost_per_vehicle.toLocaleString()}`}
            subtitle="Per vehicle"
            icon={TrendingUp}
            variant="teal"
            trend={kpiData.fleet_kpis.avg_cost_per_vehicle_trend}
          />

          {/* Additional Premium KPIs - Row 2 */}
          <Link href="/dashboard/work-orders?filter=sla">
            <PremiumMetricCard
              title="WO SLA Compliance"
              value={`${kpiData.fleet_kpis.work_order_sla_compliance.toFixed(
                1
              )}%`}
              subtitle="On-time completion"
              icon={Target}
              variant="green"
              trend={kpiData.fleet_kpis.work_order_sla_compliance_trend}
            />
          </Link>
          <Link href="/dashboard/vehicles?view=health">
            <PremiumMetricCard
              title="Fleet Health Score"
              value={`${kpiData.fleet_kpis.global_fleet_health_score}%`}
              subtitle="Overall fleet status"
              icon={Shield}
              variant="blue"
              trend={kpiData.fleet_kpis.global_fleet_health_trend}
            />
          </Link>
          <Link href="/dashboard/work-orders">
            <PremiumMetricCard
              title="WO Completion Rate"
              value={`${kpiData.fleet_kpis.work_order_completion_rate_week.toFixed(
                1
              )}%`}
              subtitle="This week"
              icon={CheckCircle2}
              variant="green"
              trend={kpiData.fleet_kpis.work_order_completion_rate_trend}
            />
          </Link>
          <Link href="/dashboard/maintenance?type=preventive">
            <PremiumMetricCard
              title="PM Compliance"
              value={`${kpiData.fleet_kpis.preventive_maintenance_compliance.toFixed(
                1
              )}%`}
              subtitle="Preventive maintenance"
              icon={Gauge}
              variant="purple"
              trend={kpiData.fleet_kpis.preventive_maintenance_compliance_trend}
            />
          </Link>
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

      {/* Stats Grid - Replaced with PremiumMetricCard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/vehicles">
          <PremiumMetricCard
            title="Total Vehicles"
            value={totalVehicles}
            subtitle="Active fleet vehicles"
            icon={Truck}
            variant="blue"
          />
        </Link>

        <Link href="/dashboard/work-orders">
          <PremiumMetricCard
            title="Active Work Orders"
            value={activeWorkOrders}
            subtitle="In progress"
            icon={Wrench}
            variant="orange"
          />
        </Link>

        <Link href="/dashboard/maintenance">
          <PremiumMetricCard
            title="Critical Issues"
            value={criticalIssues}
            subtitle="Requires immediate attention"
            icon={AlertTriangle}
            variant="rose"
          />
        </Link>

        <Link href="/dashboard/reports">
          <PremiumMetricCard
            title="Fleet Availability"
            value={`${fleetAvailability.toFixed(0)}%`}
            subtitle="Vehicles available"
            icon={CheckCircle}
            variant="green"
          />
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
