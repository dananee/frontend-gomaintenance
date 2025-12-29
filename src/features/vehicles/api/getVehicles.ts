import apiClient from "@/lib/api/axiosClient";
import { Vehicle } from "../types/vehicle.types";

export interface GetVehiclesParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  type?: string;
  include_kpis?: boolean;
}

export interface GetVehiclesResponse {
  data: Vehicle[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export const getVehicles = async (params: GetVehiclesParams = {}): Promise<GetVehiclesResponse> => {
  const response = await apiClient.get<GetVehiclesResponse>("/vehicles", { 
    params: {
      include_kpis: true,
      ...params,
    }
  });
  return response.data;
};

