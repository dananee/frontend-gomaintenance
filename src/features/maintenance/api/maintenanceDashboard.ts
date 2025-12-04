import apiClient from "@/lib/api/axiosClient";
import {
  ScheduledMaintenanceEvent,
  ActiveMaintenancePlan,
  GetScheduledMaintenanceParams,
} from "../types/maintenanceDashboard.types";

export const getScheduledMaintenance = async (
  params: GetScheduledMaintenanceParams = {}
): Promise<ScheduledMaintenanceEvent[]> => {
  // Convert array params to comma-separated strings for API
  const queryParams: any = { ...params };
  
  if (params.assets?.length) {
    queryParams.assets = params.assets.join(",");
  }
  if (params.categories?.length) {
    queryParams.categories = params.categories.join(",");
  }
  if (params.technicians?.length) {
    queryParams.technicians = params.technicians.join(",");
  }
  if (params.statuses?.length) {
    queryParams.statuses = params.statuses.join(",");
  }
  
  const response = await apiClient.get<ScheduledMaintenanceEvent[]>(
    "/maintenance/scheduled",
    { params: queryParams }
  );
  return response.data;
};

export const getActiveMaintenancePlans = async (
  filters?: {
    assets?: string[];
    statuses?: string[];
  }
): Promise<ActiveMaintenancePlan[]> => {
  const queryParams: any = {};
  
  if (filters?.assets?.length) {
    queryParams.vehicle_ids = filters.assets.join(",");
  }
  if (filters?.statuses?.length) {
    queryParams.statuses = filters.statuses.join(",");
  }
  
  const response = await apiClient.get<ActiveMaintenancePlan[]>(
    "/maintenance/plans/active",
    { params: queryParams }
  );
  return response.data;
};

