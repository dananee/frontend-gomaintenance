import apiClient from "@/lib/api/axiosClient";
import { ReceiveStockRequest } from "../types/inventory.types";

export const receiveStock = async (data: ReceiveStockRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>("/stock/receive", data);
  return response.data;
};
