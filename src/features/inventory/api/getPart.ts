import apiClient from "@/lib/api/axiosClient";
import { Part } from "../types/inventory.types";

export const getPart = async (id: string): Promise<Part> => {
  const response = await apiClient.get<Part>(`/parts/${id}`);
  return response.data;
};
