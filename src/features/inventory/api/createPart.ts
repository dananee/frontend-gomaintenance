import apiClient from "@/lib/api/axiosClient";
import { Part, CreateStockMovementRequest } from "../types/inventory.types";

export interface CreatePartRequest {
  part_number: string;
  sku: string;
  name: string;
  description?: string;
  category_id?: string;
  brand?: string;
  unit_price_ht: number;
  vat_rate: number;
  is_critical: boolean;
  min_quantity: number;
  unit: string;
  default_location?: string;
  supplier_id?: string;
}

export const createPart = async (data: CreatePartRequest): Promise<Part> => {
  const response = await apiClient.post<Part>("/parts", data);
  return response.data;
};
