import apiClient from "@/lib/api/axiosClient";
import { WorkOrder, UpdateWorkOrderStatusRequest } from "../types/workOrder.types";

export const updateWorkOrderStatus = async (
  id: string,
  status: string,
  position: number = 0,
  boardId: string = "default"
): Promise<WorkOrder> => {
  const clientRequestId = crypto.randomUUID();

  const body: UpdateWorkOrderStatusRequest = {
    status: status as any,
    position,
    boardId,
    clientRequestId,
  };

  const response = await apiClient.patch<WorkOrder>(`/work-orders/${id}/status`, body);
  return response.data;
};
