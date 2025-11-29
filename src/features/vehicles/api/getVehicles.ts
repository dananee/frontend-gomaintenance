import apiClient from "@/lib/api/axiosClient";
import { Vehicle } from "../types/vehicle.types";

export interface GetVehiclesParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  type?: string;
}

export interface GetVehiclesResponse {
  data: Vehicle[];
  page: number;
  page_size: number;
  total: number;
}

export const getVehicles = async (params: GetVehiclesParams = {}): Promise<GetVehiclesResponse> => {
  const response = await apiClient.get<GetVehiclesResponse>("/vehicles", { params });
  return response.data;
};
