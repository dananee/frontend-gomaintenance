import apiClient from "@/lib/api/axiosClient";
import {
  ScheduledMaintenanceEvent,
  ActiveMaintenancePlan,
  GetScheduledMaintenanceParams,
} from "../types/maintenanceDashboard.types";

export const getScheduledMaintenance = async (
  params: GetScheduledMaintenanceParams = {}
): Promise<ScheduledMaintenanceEvent[]> => {
  const response = await apiClient.get<ScheduledMaintenanceEvent[]>(
    "/maintenance/scheduled",
    { params }
  );
  return response.data;
};

export const getActiveMaintenancePlans = async (): Promise<ActiveMaintenancePlan[]> => {
  const response = await apiClient.get<ActiveMaintenancePlan[]>(
    "/maintenance/plans/active"
  );
  return response.data;
};
