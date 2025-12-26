import apiClient from "@/lib/api/axiosClient";
import { PartCategory } from "../types/inventory.types";

export const getPartCategories = async (): Promise<PartCategory[]> => {
  const response = await apiClient.get<PartCategory[]>("/part-categories");
  return response.data;
};
