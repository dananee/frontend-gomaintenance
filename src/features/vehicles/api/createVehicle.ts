import apiClient from "@/lib/api/axiosClient";
import { CreateVehicleDTO, Vehicle } from "../types/vehicle.types";

export const createVehicle = async (data: CreateVehicleDTO): Promise<Vehicle> => {
  const response = await apiClient.post<Vehicle>("/vehicles", data);
  return response.data;
};
