// Vehicle KPI Type Definitions

export interface MaintenanceKPIs {
  total_maintenance_cost: number;
  avg_cost_per_wo: number;
  cost_per_km: number;
  total_downtime_hours: number;
  avg_maintenance_duration: number;
  total_work_orders: number;
  next_maintenance_km: number;
  next_maintenance_date: string;
  last_maintenance_cost: number;
  last_maintenance_duration: number;
  last_maintenance_date: string;
  fuel_efficiency: number; // L/100km or MPG
  operating_cost_per_day: number;
  total_cost_of_ownership: number;
}

export interface PerformanceKPIs {
  reliability_score: number; // 0-100
  failure_rate: number; // failures per month
  mtbf: number; // Mean Time Between Failures (hours)
  mttr: number; // Mean Time To Repair (hours)
  scheduled_maintenance_compliance: number; // percentage
  preventive_vs_corrective_ratio: number;
  utilization_rate: number; // 0-100 percentage
}

export interface MonthlyCostData {
  month: string;
  cost: number;
  wo_count: number;
}

export interface WorkOrderTypeBreakdown {
  type: string;
  count: number;
  percentage: number;
  total_cost: number;
}

export interface FinancialKPIs {
  ytd_maintenance_cost: number;
  cost_trend: MonthlyCostData[];
  monthly_budget: number;
  budget_variance: number; // percentage
  cost_per_operating_hour: number;
}

export interface VehicleKPIData {
  vehicle_id: string;
  maintenance: MaintenanceKPIs;
  performance: PerformanceKPIs;
  financial: FinancialKPIs;
  work_order_breakdown: WorkOrderTypeBreakdown[];
  cost_trend_12months: MonthlyCostData[];
  downtime_trend: MonthlyCostData[];
  last_updated: string;
}

export interface VehicleKPIResponse {
  vehicle_id: string;
  data: VehicleKPIData;
  calculated_at: string;
}

// Trend data for comparison
export interface KPITrend {
  current: number;
  previous: number;
  change_percentage: number;
  direction: "up" | "down" | "stable";
}

export interface VehicleHealthScore {
  overall_score: number; // 0-100
  maintenance_score: number;
  reliability_score: number;
  cost_efficiency_score: number;
  status: "excellent" | "good" | "fair" | "poor" | "critical";
}
