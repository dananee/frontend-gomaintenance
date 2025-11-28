import apiClient from "@/lib/api/axiosClient";
import { UpdateVehicleDTO, Vehicle } from "../types/vehicle.types";

export const updateVehicle = async (data: UpdateVehicleDTO): Promise<Vehicle> => {
  const { id, ...updateData } = data;
  const response = await apiClient.put<Vehicle>(`/vehicles/${id}`, updateData);
  return response.data;
};
