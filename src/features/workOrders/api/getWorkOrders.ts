import apiClient from "@/lib/api/axiosClient";
import { WorkOrder } from "../types/workOrder.types";

export interface GetWorkOrdersParams {
  status?: string;
  priority?: string;
  vehicleId?: string;
  assignedTo?: string;
}

export interface GetWorkOrdersResponse {
  data: WorkOrder[];
  page: number;
  page_size: number;
  total: number;
}

export const getWorkOrders = async (params: GetWorkOrdersParams = {}): Promise<GetWorkOrdersResponse> => {
  const response = await apiClient.get<GetWorkOrdersResponse>("/work-orders", { params });
  return response.data;
};
