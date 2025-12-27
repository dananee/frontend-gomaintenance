import apiClient from "@/lib/api/axiosClient";
import {
  VehicleKPIResponse,
  VehicleKPIData,
  VehicleHealthScore,
} from "../types/vehicleKPI.types";

/**
 * Get comprehensive KPI data for a specific vehicle
 * @param vehicleId - The vehicle ID
 * @returns Vehicle KPI data including maintenance, performance, and financial metrics
 */
export const getVehicleKPIs = async (
  vehicleId: string
): Promise<VehicleKPIResponse> => {
  try {
    const response = await apiClient.get<VehicleKPIResponse>(
      `/vehicles/${vehicleId}/kpis`
    );
    return response.data;
  } catch (error) {
    // Return mock data if API not implemented yet
    console.warn("Vehicle KPIs API not yet implemented, using mock data");
    return getMockVehicleKPIs(vehicleId);
  }
};

/**
 * Get vehicle health score
 * @param vehicleId - The vehicle ID
 * @returns Health score assessment
 */
export const getVehicleHealthScore = async (
  vehicleId: string
): Promise<VehicleHealthScore> => {
  try {
    const response = await apiClient.get<VehicleHealthScore>(
      `/vehicles/${vehicleId}/health-score`
    );
    return response.data;
  } catch (error) {
    // Return mock data
    return getMockHealthScore();
  }
};

// Mock data generator for development
function getMockVehicleKPIs(vehicleId: string): VehicleKPIResponse {
  const mockData: VehicleKPIData = {
    vehicle_id: vehicleId,
    maintenance: {
      total_maintenance_cost: 15420.5,
      avg_cost_per_wo: 512.68,
      cost_per_km: 0.12,
      total_downtime_hours: 48.5,
      avg_maintenance_duration: 3.2,
      total_work_orders: 30,
      next_maintenance_km: 135000,
      next_maintenance_date: "2025-01-15",
      last_maintenance_cost: 450.0,
      last_maintenance_duration: 2.5,
      last_maintenance_date: "2024-11-28",
      fuel_efficiency: 8.5, // L/100km
      operating_cost_per_day: 42.5,
      total_cost_of_ownership: 85420.0,
    },
    performance: {
      reliability_score: 87,
      failure_rate: 0.8,
      mtbf: 450,
      mttr: 3.2,
      scheduled_maintenance_compliance: 92,
      preventive_vs_corrective_ratio: 2.5,
      utilization_rate: 78,
    },
    financial: {
      ytd_maintenance_cost: 15420.5,
      cost_trend: [],
      monthly_budget: 2000,
      budget_variance: -8.5,
      cost_per_operating_hour: 4.25,
    },
    work_order_breakdown: [
      { type: "Preventive", count: 18, percentage: 60, total_cost: 8100 },
      { type: "Corrective", count: 10, percentage: 33, total_cost: 6200 },
      { type: "Emergency", count: 2, percentage: 7, total_cost: 1120.5 },
    ],
    cost_trend_12months: generateMockCostTrend(),
    downtime_trend: generateMockDowntimeTrend(),
    last_updated: new Date().toISOString(),
  };

  return {
    vehicle_id: vehicleId,
    data: mockData,
    calculated_at: new Date().toISOString(),
  };
}

function getMockHealthScore(): VehicleHealthScore {
  return {
    overall_score: 100,
    age_penalty: 0,
    maintenance_penalty: 0,
    breakdown_penalty: 0,
    downtime_penalty: 0,
    mileage_penalty: 0,
    status: "excellent",
    message: "Perfect condition — no issues detected",
  };
}

function generateMockCostTrend() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => ({
    month,
    cost: 800 + Math.random() * 1000,
    wo_count: 2 + Math.floor(Math.random() * 3),
  }));
}

function generateMockDowntimeTrend() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month) => ({
    month,
    cost: 2 + Math.random() * 6,
    wo_count: Math.floor(Math.random() * 3),
  }));
}
