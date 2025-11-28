import apiClient from "@/lib/api/axiosClient";
import { UpdateWorkOrderDTO, WorkOrder } from "../types/workOrder.types";

export const updateWorkOrder = async (data: UpdateWorkOrderDTO): Promise<WorkOrder> => {
  const { id, ...updateData } = data;
  const response = await apiClient.put<WorkOrder>(`/work-orders/${id}`, updateData);
  return response.data;
};
