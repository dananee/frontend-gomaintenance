import apiClient from "@/lib/api/axiosClient";
import { ActiveMaintenancePlan, UpdatePlanData } from "../types/maintenanceDashboard.types";

/**
 * Run a maintenance plan immediately (create scheduled event)
 */
export const runPlanNow = async (planId: string): Promise<any> => {
  const response = await apiClient.post(`/maintenance/plans/${planId}/run`);
  return response.data;
};

/**
 * Pause an active maintenance plan
 */
export const pausePlan = async (planId: string): Promise<ActiveMaintenancePlan> => {
  const response = await apiClient.patch<ActiveMaintenancePlan>(
    `/maintenance/plans/${planId}/pause`
  );
  return response.data;
};

/**
 * Resume a paused maintenance plan
 */
export const resumePlan = async (planId: string): Promise<ActiveMaintenancePlan> => {
  const response = await apiClient.patch<ActiveMaintenancePlan>(
    `/maintenance/plans/${planId}/resume`
  );
  return response.data;
};

/**
 * Delete a maintenance plan
 */
export const deletePlan = async (planId: string): Promise<void> => {
  await apiClient.delete(`/maintenance/plans/${planId}`);
};

/**
 * Update a maintenance plan
 */
export const updatePlan = async (
  planId: string,
  data: UpdatePlanData
): Promise<ActiveMaintenancePlan> => {
  const response = await apiClient.patch<ActiveMaintenancePlan>(
    `/maintenance/plans/${planId}`,
    data
  );
  return response.data;
};
