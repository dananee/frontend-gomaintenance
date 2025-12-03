import { useQuery } from "@tanstack/react-query";
import {
  getScheduledMaintenance,
  getActiveMaintenancePlans,
} from "../api/maintenanceDashboard";
import { GetScheduledMaintenanceParams } from "../types/maintenanceDashboard.types";

export const useScheduledMaintenance = (
  params: GetScheduledMaintenanceParams = {}
) => {
  return useQuery({
    queryKey: ["maintenance", "scheduled", params],
    queryFn: () => getScheduledMaintenance(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActiveMaintenancePlans = () => {
  return useQuery({
    queryKey: ["maintenance", "plans", "active"],
    queryFn: getActiveMaintenancePlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
