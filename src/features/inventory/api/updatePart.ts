import apiClient from "@/lib/api/axiosClient";
import { Part } from "../types/inventory.types";

export interface UpdatePartRequest {
  part_number?: string;
  sku?: string;
  name?: string;
  description?: string;
  category_id?: string;
  brand?: string;
  unit_price_ht?: number;
  vat_rate?: number;
  is_critical?: boolean;
  min_quantity?: number;
  unit?: string;
  default_location?: string;
  supplier_id?: string;
}

export const updatePart = async (id: string, data: UpdatePartRequest): Promise<Part> => {
  const response = await apiClient.put<Part>(`/parts/${id}`, data);
  return response.data;
};
