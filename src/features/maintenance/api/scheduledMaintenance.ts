import apiClient from "@/lib/api/axiosClient";
import {
  ScheduledMaintenance,
  CreateScheduledMaintenanceRequest,
  UpdateScheduledMaintenanceRequest,
  ScheduledMaintenanceFilters,
} from "../types/scheduledMaintenance.types";

export const getScheduledMaintenances = async (
  filters?: ScheduledMaintenanceFilters
): Promise<ScheduledMaintenance[]> => {
  const response = await apiClient.get<ScheduledMaintenance[]>(
    "/scheduled-maintenance",
    { params: filters }
  );
  return response.data;
};

export const getScheduledMaintenance = async (
  id: string
): Promise<ScheduledMaintenance> => {
  const response = await apiClient.get<ScheduledMaintenance>(
    `/scheduled-maintenance/${id}`
  );
  return response.data;
};

export const createScheduledMaintenance = async (
  data: CreateScheduledMaintenanceRequest
): Promise<ScheduledMaintenance> => {
  const response = await apiClient.post<ScheduledMaintenance>(
    "/scheduled-maintenance",
    data
  );
  return response.data;
};

export const updateScheduledMaintenance = async (
  id: string,
  data: UpdateScheduledMaintenanceRequest
): Promise<ScheduledMaintenance> => {
  const response = await apiClient.put<ScheduledMaintenance>(
    `/scheduled-maintenance/${id}`,
    data
  );
  return response.data;
};

export const deleteScheduledMaintenance = async (
  id: string
): Promise<void> => {
  await apiClient.delete(`/scheduled-maintenance/${id}`);
};

export const convertToWorkOrder = async (
  id: string
): Promise<{ work_order: any; scheduled_maintenance: ScheduledMaintenance }> => {
  const response = await apiClient.post(
    `/scheduled-maintenance/${id}/convert-to-work-order`
  );
  return response.data;
};
