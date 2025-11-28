import apiClient from "@/lib/api/axiosClient";
import { Part } from "../types/inventory.types";

export interface GetPartsResponse {
  data: Part[];
  page: number;
  page_size: number;
  total: number;
}

export interface GetPartsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  warehouse?: string;
  low_stock?: boolean;
}

export const getParts = async (params: GetPartsParams = {}): Promise<GetPartsResponse> => {
  const response = await apiClient.get<GetPartsResponse>("/parts", { params });
  return response.data;
};
