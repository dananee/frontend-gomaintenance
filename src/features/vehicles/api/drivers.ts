import { apiClient } from "@/lib/api/axiosClient";
import type {
  VehicleDriver,
  AssignDriversRequest,
  UpdateDriverAssignmentRequest,
} from "../types/driver";

/**
 * Assign one or multiple drivers to a vehicle
 */
export const assignDrivers = async (
  vehicleId: string,
  data: AssignDriversRequest
): Promise<VehicleDriver[]> => {
  const response = await apiClient.post<VehicleDriver[]>(
    `/vehicles/${vehicleId}/drivers`,
    data
  );
  return response.data;
};

/**
 * Get all drivers assigned to a vehicle
 */
export const getVehicleDrivers = async (
  vehicleId: string
): Promise<VehicleDriver[]> => {
  const response = await apiClient.get<VehicleDriver[]>(
    `/vehicles/${vehicleId}/drivers`
  );
  return response.data;
};

/**
 * Unassign a driver from a vehicle
 */
export const unassignDriver = async (
  vehicleId: string,
  driverId: string
): Promise<void> => {
  await apiClient.delete(`/vehicles/${vehicleId}/drivers/${driverId}`);
};

/**
 * Update a driver assignment (dates, primary status)
 */
export const updateDriverAssignment = async (
  vehicleId: string,
  driverId: string,
  data: UpdateDriverAssignmentRequest
): Promise<VehicleDriver> => {
  const response = await apiClient.put<VehicleDriver>(
    `/vehicles/${vehicleId}/drivers/${driverId}`,
    data
  );
  return response.data;
};
