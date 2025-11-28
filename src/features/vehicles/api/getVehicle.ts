import apiClient from "@/lib/api/axiosClient";
import { Vehicle } from "../types/vehicle.types";

export const getVehicle = async (id: string): Promise<Vehicle> => {
  const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
  return response.data;
};
