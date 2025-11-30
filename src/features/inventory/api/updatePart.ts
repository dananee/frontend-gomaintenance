import apiClient from "@/lib/api/axiosClient";
import type { Part } from "../types/inventory.types";

export interface UpdatePartRequest {
  part_number?: string;
  name?: string;
  description?: string;
  brand?: string;
  unit_price?: number;
  min_stock_level?: number;
}

export const updatePart = async (id: string, data: UpdatePartRequest): Promise<Part> => {
  const response = await apiClient.put<Part>(`/parts/${id}`, data);
  return response.data;
};
