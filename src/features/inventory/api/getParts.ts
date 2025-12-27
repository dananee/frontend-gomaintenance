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
  page_size?: number;
  search?: string;
  category_id?: string;
}

export const getParts = async (params: GetPartsParams = {}): Promise<GetPartsResponse> => {
  const response = await apiClient.get<GetPartsResponse>("/parts", { params });
  return response.data;
};
