import apiClient from "@/lib/api/axiosClient";

export interface WorkOrderCosts {
  work_order_id: string;
  labor_cost: number;
  parts_cost: number;
  external_service_cost: number;
  total_cost: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWorkOrderCostsRequest {
  labor_cost: number;
  parts_cost: number;
  external_service_cost: number;
}

export interface UpdateWorkOrderCostsRequest {
  labor_cost?: number;
  parts_cost?: number;
  external_service_cost?: number;
}

// Get costs for a work order
export const getWorkOrderCosts = async (workOrderId: string): Promise<WorkOrderCosts> => {
  const response = await apiClient.get<WorkOrderCosts>(`/work-orders/${workOrderId}/costs`);
  return response.data;
};

// Create costs for a work order
export const createWorkOrderCosts = async (
  workOrderId: string,
  data: CreateWorkOrderCostsRequest
): Promise<WorkOrderCosts> => {
  const response = await apiClient.post<WorkOrderCosts>(`/work-orders/${workOrderId}/costs`, data);
  return response.data;
};

// Update costs for a work order
export const updateWorkOrderCosts = async (
  workOrderId: string,
  data: UpdateWorkOrderCostsRequest
): Promise<WorkOrderCosts> => {
  const response = await apiClient.put<WorkOrderCosts>(`/work-orders/${workOrderId}/costs`, data);
  return response.data;
};
