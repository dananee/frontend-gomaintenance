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
  brand?: string;
}

export const getParts = async (params: GetPartsParams = {}): Promise<GetPartsResponse> => {
  const response = await apiClient.get<GetPartsResponse>("/parts", { params });
  return {
    ...response.data,
    data: response.data.data.map((part) => ({
      ...part,
      cost: part.cost ?? part.unit_price ?? 0,
      quantity: part.quantity ?? 0,
      min_quantity: part.min_quantity ?? 0,
      location: part.location || part.warehouse || "",
    })),
  };
};
