import { apiClient } from "@/lib/api/axiosClient";

export type HistoryEvent = {
  id: string;
  type: "work_order" | "plan" | "activity";
  date: string;
  title: string;
  description: string;
  status: string;
  actor_name?: string;
  entity_id?: string;
};

export const getVehicleHistory = async (
  vehicleId: string
): Promise<HistoryEvent[]> => {
  const response = await apiClient.get(`/vehicles/${vehicleId}/history`);
  return response.data;
};
