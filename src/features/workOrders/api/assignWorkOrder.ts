import apiClient from "@/lib/api/axiosClient";
import { WorkOrder } from "../types/workOrder.types";

export interface AssignWorkOrderRequest {
  assigned_to: string;
}

export const assignWorkOrder = async (id: string, assignedTo: string): Promise<WorkOrder> => {
  const response = await apiClient.patch<WorkOrder>(`/work-orders/${id}/assign`, {
    assigned_to: assignedTo,
  });
  return response.data;
};
