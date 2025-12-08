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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PremiumMetricCard
          title="Total Vehicles"
          value="42"
          icon={Truck}
          trend={{ value: 12, isPositive: true }}
          subtitle="Active fleet"
        />
        <PremiumMetricCard
          title="Active Work Orders"
          value="18"
          icon={Wrench}
          trend={{ value: 5, isPositive: false }}
          subtitle="In progress"
        />
        <PremiumMetricCard
          title="Maintenance Due"
          value="7"
          icon={AlertTriangle}
          trend={{ value: 23, isPositive: true }}
          subtitle="Require attention"
        />
        <PremiumMetricCard
          title="Uptime"
          value="98.7%"
          icon={CheckCircle}
          trend={{ value: 1.2, isPositive: true }}
          subtitle="Fleet availability"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Maintenance Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="h-80 animate-pulse bg-muted rounded" />}
            >
              <CostChart />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Availability Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="h-80 animate-pulse bg-muted rounded" />}
            >
              <AvailabilityChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverdueWorkOrders />
        <VehiclesNeedingMaintenance />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Average MTTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <TrendBadge value={-15} />
            <p className="text-xs text-muted-foreground mt-1">
              Mean Time To Repair
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" />
              MTBF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450h</div>
            <TrendBadge value={8} />
            <p className="text-xs text-muted-foreground mt-1">
              Mean Time Between Failures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              OEE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <TrendBadge value={3.2} />
            <p className="text-xs text-muted-foreground mt-1">
              Overall Equipment Effectiveness
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
