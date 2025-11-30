import apiClient from "@/lib/api/axiosClient";
import type { Part } from "../types/inventory.types";

export interface CreatePartRequest {
  part_number: string;
  name: string;
  description?: string;
  brand?: string;
  unit_price: number;
  min_stock_level?: number;
}

export const createPart = async (data: CreatePartRequest): Promise<Part> => {
  const response = await apiClient.post<Part>("/parts", data);
  return response.data;
};
