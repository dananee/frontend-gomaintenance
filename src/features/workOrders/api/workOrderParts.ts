import apiClient from "@/lib/api/axiosClient";

import { Part } from "@/features/inventory/types/inventory.types";

export interface WorkOrderPart {
  id: string;
  work_order_id: string;
  part_id: string;
  part?: Part;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface AddWorkOrderPartRequest {
  part_id: string;
  quantity: number;
  unit_price: number;
  warehouse_id?: string;
}

// List all parts used in a work order
export const listWorkOrderParts = async (workOrderId: string): Promise<WorkOrderPart[]> => {
  const response = await apiClient.get<WorkOrderPart[]>(`/work-orders/${workOrderId}/parts`);
  return response.data;
};

// Add a part to a work order
export const addWorkOrderPart = async (
  workOrderId: string,
  data: AddWorkOrderPartRequest
): Promise<WorkOrderPart> => {
  const response = await apiClient.post<WorkOrderPart>(`/work-orders/${workOrderId}/parts`, data);
  return response.data;
};

// Remove a part from a work order
export const removeWorkOrderPart = async (
  workOrderId: string,
  partUseId: string
): Promise<void> => {
  await apiClient.delete(`/work-orders/${workOrderId}/parts/${partUseId}`);
};
