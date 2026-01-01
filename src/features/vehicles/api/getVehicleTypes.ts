import { apiClient } from "@/lib/api/axiosClient";
import { VehicleType } from "../types/vehicle.types";

export const getVehicleTypes = async (): Promise<VehicleType[]> => {
  const response = await apiClient.get<VehicleType[]>("/vehicles/types");
  return response.data;
};
