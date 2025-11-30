import apiClient from "@/lib/api/axiosClient";

export interface UpdateVehicleUsageRequest {
  current_km?: number;
  current_engine_hours?: number;
}

export const updateVehicleUsage = async (
  vehicleId: string,
  data: UpdateVehicleUsageRequest
): Promise<void> => {
  await apiClient.post(`/vehicles/${vehicleId}/usage`, data);
};
