// Dashboard KPI Type Definitions

export interface FleetKPIs {
  total_fleet_value: number;
  total_maintenance_cost_ytd: number;
  total_maintenance_cost_ytd_trend?: KPITrend;
  avg_maintenance_cost_per_vehicle: number;
  total_downtime_hours_month: number;
  total_downtime_hours_month_trend?: KPITrend;
  avg_downtime_per_vehicle: number;
  avg_downtime_per_vehicle_trend?: KPITrend;
  fleet_mttr: number; // Mean Time To Repair (hours)
  fleet_mtbf: number; // Mean Time Between Failures (hours)
  total_vehicles: number;
  active_vehicles: number;
  vehicles_in_maintenance: number;
  fleet_efficiency_score: number; // 0-100
  fleet_efficiency_trend?: KPITrend;
  scheduled_vs_corrective_ratio: number; // e.g., 2.5 = 2.5:1 ratio
  scheduled_vs_corrective_trend?: KPITrend;
  total_cost_of_ownership: number;
  work_order_sla_compliance: number; // percentage 0-100
  work_order_sla_compliance_trend?: KPITrend;
  cost_per_vehicle_average: number; // fleet-wide average
  avg_cost_per_vehicle_trend?: KPITrend;
  global_fleet_health_score: number; // 0-100
  global_fleet_health_trend?: KPITrend;
  work_order_completion_rate_week: number; // percentage 0-100
  work_order_completion_rate_trend?: KPITrend;
  preventive_maintenance_compliance: number; // percentage 0-100
  preventive_maintenance_compliance_trend?: KPITrend;
}

export interface MonthlyTrendData {
  month: string;
  value: number;
  label?: string;
}

export interface WorkOrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FleetHealthScore {
  overall_score: number; // 0-100
  healthy_vehicles: number;
  maintenance_due: number;
  critical_vehicles: number;
  status: "excellent" | "good" | "fair" | "poor" | "critical";
}

export interface DashboardKPIResponse {
  fleet_kpis: FleetKPIs;
  cost_trend_12months: MonthlyTrendData[];
  downtime_trend_12months: MonthlyTrendData[];
  work_order_distribution: WorkOrderStatusDistribution[];
  fleet_health: FleetHealthScore;
  top_fault_types: { type: string; count: number; color: string }[];
  technician_performance: {
    name: string;
    completed_wos: number;
    avg_time: number;
    efficiency_score: number;
  }[];
  sla_compliance: {
    onTime: number;
    delayed: number;
    breached: number;
    totalWOs: number;
  };
  mttr_trend: { month: string; mttr: number }[];
  cost_forecast: {
    month: string;
    actual?: number;
    predicted: number;
    confidence: { lower: number; upper: number };
  }[];
  workload_heatmap: {
    technician: string;
    months: { month: string; workload: number }[];
  }[];
  failure_predictions: {
    vehicle_id: string;
    vehicle_name: string;
    risk_score: number;
    predicted_failure_days: number;
    component: string;
    confidence: number;
  }[];
  calculated_at: string;
}

export interface KPITrend {
  value: number;              // Percentage change
  isPositive: boolean;        // Whether increase is good
  previousValue?: number;     // Previous period value
  currentValue?: number;      // Current period value
}
