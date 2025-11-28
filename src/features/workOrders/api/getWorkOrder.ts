import apiClient from "@/lib/api/axiosClient";
import { WorkOrder } from "../types/workOrder.types";

export const getWorkOrder = async (id: string): Promise<WorkOrder> => {
  const response = await apiClient.get<WorkOrder>(`/work-orders/${id}`);
  return response.data;
};
