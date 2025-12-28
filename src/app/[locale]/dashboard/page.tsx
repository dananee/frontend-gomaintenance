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

const FleetHealthScoreChart = lazy(() =>
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

import { useDashboardKPIs } from "@/features/dashboard/hooks/useDashboardKPIs";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getWorkOrders } from "@/features/workOrders/api/getWorkOrders";
import { getFleetAvailability } from "@/features/reports/api/reports";
import { getScheduledMaintenance } from "@/features/maintenance/api/maintenanceDashboard";

export default function DashboardPage() {
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

  // Use KPI data for vehicle count (already includes total_vehicles from backend)
  const totalVehicles = kpiData?.fleet_kpis?.total_vehicles || 0;
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
    <div className="space-y-8 p-6 bg-slate-50/50 dark:bg-transparent min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre flotte et suivez les indicateurs de performance en temps réel.
          </p>
        </div>
      </div>

      {/* SECTION 1 — Executive KPIs (Top row – MAX 5) */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {t("sections.strategicIndicators")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Fleet Availability */}
          <PremiumMetricCard
            title={t("stats.fleetAvailability.title")}
            value={`${fleetAvailability.toFixed(1)}%`}
            subtitle={t("stats.fleetAvailability.subtitle")}
            icon={CheckCircle}
            variant="green"
          />

          {/* Fleet Health Score */}
          <PremiumMetricCard
            title={t("kpis.fleetHealthScore.title")}
            value={`${kpiData?.fleet_kpis?.global_fleet_health_score || 0}%`}
            subtitle={t("kpis.fleetHealthScore.subtitle")}
            icon={Shield}
            variant="blue"
          />

          {/* Active Work Orders */}
          <PremiumMetricCard
            title={t("stats.activeWorkOrders.title")}
            value={activeWorkOrders}
            subtitle={t("stats.activeWorkOrders.subtitle")}
            icon={Wrench}
            variant="orange"
          />

          {/* Critical Issues */}
          <PremiumMetricCard
            title={t("stats.criticalIssues.title")}
            value={criticalIssues}
            subtitle={t("stats.criticalIssues.subtitle")}
            icon={AlertTriangle}
            variant="rose"
          />

          {/* Downtime (hours) */}
          <PremiumMetricCard
            title={t("kpis.downtimeMonth.title")}
            value={`${kpiData?.fleet_kpis?.total_downtime_hours_month || 0}h`}
            subtitle={t("kpis.downtimeMonth.subtitle")}
            icon={Clock}
            variant="purple"
          />
        </div>
      </section>

      {/* SECTION 2 — Operational KPIs */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          {t("sections.operationalPerformance")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PremiumMetricCard
            title={t("kpis.mttr.title")}
            value={`${kpiData?.fleet_kpis?.fleet_mttr || 0}h`}
            subtitle={t("kpis.mttr.subtitle")}
            icon={Timer}
            variant="teal"
          />
          <PremiumMetricCard
            title={t("kpis.mtbf.title")}
            value={`${kpiData?.fleet_kpis?.fleet_mtbf || 0}h`}
            subtitle={t("kpis.mtbf.subtitle")}
            icon={Zap}
            variant="teal"
          />
          <PremiumMetricCard
            title={t("kpis.woSlaCompliance.title")}
            value={`${kpiData?.fleet_kpis?.work_order_sla_compliance?.toFixed(1) || 0}%`}
            subtitle={t("kpis.woSlaCompliance.subtitle")}
            icon={Target}
            variant="blue"
          />
          <PremiumMetricCard
            title={t("kpis.pmCompliance.title")}
            value={`${kpiData?.fleet_kpis?.preventive_maintenance_compliance?.toFixed(1) || 0}%`}
            subtitle={t("kpis.pmCompliance.subtitle")}
            icon={Gauge}
            variant="purple"
          />
        </div>
      </section>

      {/* SECTION 3 — Trends & Analytics (Charts) */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {t("sections.analyticsTrends")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-[350px] w-full animate-pulse rounded-xl bg-muted" />}>
              <CostTrendChart data={kpiData?.cost_trend_12months || []} />
            </Suspense>
          </div>
          <div>
            <Suspense fallback={<div className="h-[350px] w-full animate-pulse rounded-xl bg-muted" />}>
              {kpiData?.fleet_health && <FleetHealthScoreChart data={kpiData.fleet_health} />}
            </Suspense>
          </div>
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-[350px] w-full animate-pulse rounded-xl bg-muted" />}>
              <DowntimeChart data={kpiData?.downtime_trend_12months || []} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Alerts & Actions */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {t("sections.alertsActions")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <OverdueWorkOrders data={kpiData?.overdue_work_orders || []} />
          <VehiclesNeedingMaintenance data={kpiData?.vehicles_needing_maintenance || []} />
        </div>
      </section>

      {/* SECTION 5 — Deep Analysis */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {t("sections.deepAnalysis")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Suspense fallback={<div className="h-[300px] w-full animate-pulse rounded-xl bg-muted" />}>
              <TopFaultTypesChart data={kpiData?.top_fault_types || []} />
            </Suspense>
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-[300px] w-full animate-pulse rounded-xl bg-muted" />}>
              <TechnicianPerformanceChart
                data={kpiData?.technician_performance || []}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
