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
import { useTranslations } from "next-intl";

// Lazy load charts
const CostChart = lazy(() =>
  import("@/features/reports/components/CostChart").then((module) => ({
    default: module.CostChart,
  }))
);
const AvailabilityChart = lazy(() =>
  import("@/features/reports/components/AvailabilityChart").then((module) => ({
    default: module.AvailabilityChart,
  }))
);
const CostTrendChart = lazy(() =>
  import("@/features/dashboard/components/CostTrendChart").then((module) => ({
    default: module.CostTrendChart,
  }))
);
const DowntimeChart = lazy(() =>
  import("@/features/dashboard/components/DowntimeChart").then((module) => ({
    default: module.DowntimeChart,
  }))
);
const WorkOrderPieChart = lazy(() =>
  import("@/features/dashboard/components/WorkOrderPieChart").then(
    (module) => ({ default: module.WorkOrderPieChart })
  )
);
const FleetHealthScore = lazy(() =>
  import("@/features/dashboard/components/FleetHealthScore").then((module) => ({
    default: module.FleetHealthScore,
  }))
);
const TopFaultTypesChart = lazy(() =>
  import("@/features/dashboard/components/TopFaultTypesChart").then(
    (module) => ({ default: module.TopFaultTypesChart })
  )
);
const TechnicianPerformanceChart = lazy(() =>
  import("@/features/dashboard/components/TechnicianPerformanceChart").then(
    (module) => ({ default: module.TechnicianPerformanceChart })
  )
);
const SLAComplianceChart = lazy(() =>
  import("@/features/dashboard/components/SLAComplianceChart").then(
    (module) => ({ default: module.SLAComplianceChart })
  )
);
const MTTRTrendChart = lazy(() =>
  import("@/features/dashboard/components/MTTRTrendChart").then((module) => ({
    default: module.MTTRTrendChart,
  }))
);
const CostForecastChart = lazy(() =>
  import("@/features/dashboard/components/CostForecastChart").then(
    (module) => ({ default: module.CostForecastChart })
  )
);
const WorkloadHeatmap = lazy(() =>
  import("@/features/dashboard/components/WorkloadHeatmap").then((module) => ({
    default: module.WorkloadHeatmap,
  }))
);
const FailurePredictionWidget = lazy(() =>
  import("@/features/dashboard/components/FailurePredictionWidget").then(
    (module) => ({ default: module.FailurePredictionWidget })
  )
);
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
  const urgentWorkOrders =
    criticalWorkOrdersData?.data?.filter((wo) => wo.priority === "urgent")
      .length || 0;
  const criticalMaintenanceEvents =
    criticalMaintenanceData?.filter(
      (event) => event.priority === "critical" || event.priority === "high"
    ).length || 0;
  const criticalIssues = urgentWorkOrders + criticalMaintenanceEvents;

  const fleetAvailability = fleetAvailabilityData?.availability_percent || 0;
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>

      {/* Fleet KPIs */}
      {kpiData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Financial KPIs - Purple/Blue Gradient */}
          <Link href="/dashboard/vehicles">
            <PremiumMetricCard
              title={t("kpis.totalFleetValue.title")}
              value={`$${(kpiData.fleet_kpis.total_fleet_value / 1000).toFixed(
                0
              )}K`}
              subtitle={t("kpis.totalFleetValue.subtitle")}
              icon={DollarSign}
              variant="purple"
            />
          </Link>
          <Link href="/dashboard/reports?type=cost">
            <PremiumMetricCard
              title={t("kpis.maintenanceCostYTD.title")}
              value={`$${(
                kpiData.fleet_kpis.total_maintenance_cost_ytd / 1000
              ).toFixed(0)}K`}
              subtitle={t("kpis.maintenanceCostYTD.subtitle")}
              icon={Wrench}
              variant="purple"
              trend={kpiData.fleet_kpis.total_maintenance_cost_ytd_trend}
            />
          </Link>
          <Link href="/dashboard/reports?type=tco">
            <PremiumMetricCard
              title={t("kpis.totalCostOfOwnership.title")}
              value={`$${(
                kpiData.fleet_kpis.total_cost_of_ownership / 1000
              ).toFixed(0)}K`}
              subtitle={t("kpis.totalCostOfOwnership.subtitle")}
              icon={DollarSign}
              variant="purple"
            />
          </Link>

          {/* Performance KPIs - Green/Blue Gradient */}
          <PremiumMetricCard
            title={t("kpis.fleetEfficiency.title")}
            value={`${kpiData.fleet_kpis.fleet_efficiency_score}%`}
            subtitle={t("kpis.fleetEfficiency.subtitle")}
            icon={Activity}
            variant="green"
            trend={kpiData.fleet_kpis.fleet_efficiency_trend}
          />
          <PremiumMetricCard
            title={t("kpis.scheduledVsCorrective.title")}
            value={`${kpiData.fleet_kpis.scheduled_vs_corrective_ratio.toFixed(
              1
            )}:1`}
            subtitle={t("kpis.scheduledVsCorrective.subtitle")}
            icon={BarChart3}
            variant="green"
            trend={kpiData.fleet_kpis.scheduled_vs_corrective_trend}
          />

          {/* Risk KPIs - Orange/Red Gradient */}
          <Link href="/dashboard/vehicles?status=maintenance">
            <PremiumMetricCard
              title={t("kpis.downtimeMonth.title")}
              value={`${kpiData.fleet_kpis.total_downtime_hours_month}h`}
              subtitle={t("kpis.downtimeMonth.subtitle")}
              icon={Clock}
              variant="orange"
              trend={kpiData.fleet_kpis.total_downtime_hours_month_trend}
            />
          </Link>
          <PremiumMetricCard
            title={t("kpis.avgDowntimeVehicle.title")}
            value={`${kpiData.fleet_kpis.avg_downtime_per_vehicle.toFixed(1)}h`}
            subtitle={t("kpis.avgDowntimeVehicle.subtitle")}
            icon={Clock}
            variant="orange"
            trend={kpiData.fleet_kpis.avg_downtime_per_vehicle_trend}
          />

          {/* Availability KPIs - Cyan/Blue Gradient */}
          <PremiumMetricCard
            title={t("kpis.mttr.title")}
            value={`${kpiData.fleet_kpis.fleet_mttr}h`}
            subtitle={t("kpis.mttr.subtitle")}
            icon={Timer}
            variant="teal"
          />
          <PremiumMetricCard
            title={t("kpis.mtbf.title")}
            value={`${kpiData.fleet_kpis.fleet_mtbf}h`}
            subtitle={t("kpis.mtbf.subtitle")}
            icon={Zap}
            variant="teal"
          />
          <PremiumMetricCard
            title={t("kpis.avgCostVehicle.title")}
            value={`$${kpiData.fleet_kpis.avg_maintenance_cost_per_vehicle.toLocaleString()}`}
            subtitle={t("kpis.avgCostVehicle.subtitle")}
            icon={TrendingUp}
            variant="teal"
            trend={kpiData.fleet_kpis.avg_cost_per_vehicle_trend}
          />

          {/* Additional Premium KPIs - Row 2 */}
          <Link href="/dashboard/work-orders?filter=sla">
            <PremiumMetricCard
              title={t("kpis.woSlaCompliance.title")}
              value={`${kpiData.fleet_kpis.work_order_sla_compliance.toFixed(
                1
              )}%`}
              subtitle={t("kpis.woSlaCompliance.subtitle")}
              icon={Target}
              variant="green"
              trend={kpiData.fleet_kpis.work_order_sla_compliance_trend}
            />
          </Link>
          <Link href="/dashboard/vehicles?view=health">
            <PremiumMetricCard
              title={t("kpis.fleetHealthScore.title")}
              value={`${kpiData.fleet_kpis.global_fleet_health_score}%`}
              subtitle={t("kpis.fleetHealthScore.subtitle")}
              icon={Shield}
              variant="blue"
              trend={kpiData.fleet_kpis.global_fleet_health_trend}
            />
          </Link>
          <Link href="/dashboard/work-orders">
            <PremiumMetricCard
              title={t("kpis.woCompletionRate.title")}
              value={`${kpiData.fleet_kpis.work_order_completion_rate_week.toFixed(
                1
              )}%`}
              subtitle={t("kpis.woCompletionRate.subtitle")}
              icon={CheckCircle2}
              variant="green"
              trend={kpiData.fleet_kpis.work_order_completion_rate_trend}
            />
          </Link>
          <Link href="/dashboard/maintenance?type=preventive">
            <PremiumMetricCard
              title={t("kpis.pmCompliance.title")}
              value={`${kpiData.fleet_kpis.preventive_maintenance_compliance.toFixed(
                1
              )}%`}
              subtitle={t("kpis.pmCompliance.subtitle")}
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
            {t("sections.fleetAnalytics")}
          </span>
        </div>
      </div>

      {/* Stats Grid - Replaced with PremiumMetricCard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/vehicles">
          <PremiumMetricCard
            title={t("stats.totalVehicles.title")}
            value={totalVehicles}
            subtitle={t("stats.totalVehicles.subtitle")}
            icon={Truck}
            variant="blue"
          />
        </Link>

        <Link href="/dashboard/work-orders">
          <PremiumMetricCard
            title={t("stats.activeWorkOrders.title")}
            value={activeWorkOrders}
            subtitle={t("stats.activeWorkOrders.subtitle")}
            icon={Wrench}
            variant="orange"
          />
        </Link>

        <Link href="/dashboard/maintenance">
          <PremiumMetricCard
            title={t("stats.criticalIssues.title")}
            value={criticalIssues}
            subtitle={t("stats.criticalIssues.subtitle")}
            icon={AlertTriangle}
            variant="rose"
          />
        </Link>

        <Link href="/dashboard/reports">
          <PremiumMetricCard
            title={t("stats.fleetAvailability.title")}
            value={`${fleetAvailability.toFixed(0)}%`}
            subtitle={t("stats.fleetAvailability.subtitle")}
            icon={CheckCircle}
            variant="green"
          />
        </Link>
      </div>

      {/* Widgets Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <OverdueWorkOrders data={kpiData?.overdue_work_orders || []} />
        <VehiclesNeedingMaintenance data={kpiData?.vehicles_needing_maintenance || []} />
      </div>

      {/* Charts Grid */}
      {kpiData && (
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
          }
        >
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
                {t("sections.predictiveAI")}
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
          <Suspense
            fallback={
              <div className="h-96 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            }
          >
            <CostChart />
          </Suspense>
        </div>
        <div className="col-span-3">
          <Suspense
            fallback={
              <div className="h-96 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            }
          >
            <AvailabilityChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
