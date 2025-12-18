import apiClient from "@/lib/api/axiosClient";
import { WorkOrder, UpdateWorkOrderStatusRequest } from "../types/workOrder.types";

export const updateWorkOrderStatus = async (
  id: string,
  request: UpdateWorkOrderStatusRequest
): Promise<WorkOrder> => {
  const response = await apiClient.patch<WorkOrder>(`/work-orders/${id}/status`, request);
  return response.data;
};
