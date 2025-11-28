import apiClient from "@/lib/api/axiosClient";
import { CreateWorkOrderDTO, WorkOrder } from "../types/workOrder.types";

export const createWorkOrder = async (data: CreateWorkOrderDTO): Promise<WorkOrder> => {
  const response = await apiClient.post<WorkOrder>("/work-orders", data);
  return response.data;
};
