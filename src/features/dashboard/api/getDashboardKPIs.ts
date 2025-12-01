import apiClient from "@/lib/api/axiosClient";
import { DashboardKPIResponse } from "../types/dashboardKPI.types";

/**
 * Fetches dashboard KPIs from the backend API
 * 
 * This endpoint provides ALL dashboard data including:
 * - Fleet KPIs (15+ metrics with trends)
 * - Cost trends (12 months)
 * - Downtime trends (12 months)
 * - Work order distribution
 * - Fleet health score
 * - Top fault types
 * - Technician performance
 * - SLA compliance
 * - MTTR trends
 * - Cost forecast (6 months)
 * - Workload heatmap
 * - AI failure predictions
 * 
 * All data is calculated in real-time from the database.
 * Backend caches results for 5 minutes for performance.
 */
export const getDashboardKPIs = async (): Promise<DashboardKPIResponse> => {
  const response = await apiClient.get<DashboardKPIResponse>("/dashboard/kpis");
  return response.data;
};
