import apiClient from "@/lib/api/axiosClient";

export interface VehicleMaintenancePlan {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  template_id: string;
  interval_km: number;
  interval_months: number;
  last_service_km: number;
  last_service_date: string;
  next_due_mileage?: number;
  next_due_date?: string;
  is_active: boolean;
  priority: string;
  created_at: string;
  updated_at: string;
  template?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface CreateMaintenancePlanRequest {
  template_id: string;
  interval_km: number;
  interval_months: number;
  last_service_km?: number;
  last_service_date?: string;
  priority?: string;
}

export const getVehicleMaintenancePlans = async (
  vehicleId: string
): Promise<VehicleMaintenancePlan[]> => {
  const response = await apiClient.get<VehicleMaintenancePlan[]>(
    `/vehicles/${vehicleId}/maintenance-plans`
  );
  return response.data;
};

export const createVehicleMaintenancePlan = async (
  vehicleId: string,
  data: CreateMaintenancePlanRequest
): Promise<VehicleMaintenancePlan> => {
  const response = await apiClient.post<VehicleMaintenancePlan>(
    `/vehicles/${vehicleId}/maintenance-plans`,
    data
  );
  return response.data;
};

export const updateVehicleMaintenancePlan = async (
  vehicleId: string,
  planId: string,
  data: CreateMaintenancePlanRequest
): Promise<VehicleMaintenancePlan> => {
  const response = await apiClient.put<VehicleMaintenancePlan>(
    `/vehicles/${vehicleId}/maintenance-plans/${planId}`,
    data
  );
  return response.data;
};

export const deleteVehicleMaintenancePlan = async (
  vehicleId: string,
  planId: string
): Promise<void> => {
  await apiClient.delete(`/vehicles/${vehicleId}/maintenance-plans/${planId}`);
};
