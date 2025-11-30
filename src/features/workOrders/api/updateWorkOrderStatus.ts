import apiClient from "@/lib/api/axiosClient";
import { WorkOrder, WorkOrderStatus } from "../types/workOrder.types";

export interface UpdateWorkOrderStatusRequest {
  status: WorkOrderStatus;
}

export const updateWorkOrderStatus = async (
  id: string,
  status: WorkOrderStatus
): Promise<WorkOrder> => {
  const response = await apiClient.patch<WorkOrder>(`/work-orders/${id}/status`, { status });
  return response.data;
};
