import apiClient from "@/lib/api/axiosClient";
import { WorkOrder } from "../types/workOrder.types";

export interface GetWorkOrdersParams {
  page?: number;
  page_size?: number;
  status?: string;
  type?: string;
  vehicle_id?: string;
  assigned_to?: string;
}

export interface GetWorkOrdersResponse {
  data: WorkOrder[];
  page: number;
  page_size: number;
  total: number;
  total_items?: number;
  total_pages?: number;
}

// Backend response includes nested vehicle object
interface BackendWorkOrder {
  id: string;
  vehicle_id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to?: string;
  assignees?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }>;
  scheduled_date?: string;
  completed_date?: string;
  estimated_duration?: number;
  category?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  vehicle?: {
    id: string;
    plate_number: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    status: string;
  };
  created_user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  assigned_user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  cost?: {
    id: string;
    work_order_id: string;
    labor_cost: number;
    parts_cost: number;
    external_service_cost: number;
    total_cost: number;
  };
}

interface BackendResponse {
  data: BackendWorkOrder[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export const getWorkOrders = async (params: GetWorkOrdersParams = {}): Promise<GetWorkOrdersResponse> => {
  const response = await apiClient.get<BackendResponse>("/work-orders", { params });
  
  // Transform backend response to match frontend WorkOrder type
  const transformedData: WorkOrder[] = response.data.data.map((wo) => ({
    id: wo.id,
    vehicle_id: wo.vehicle_id,
    vehicle_name: wo.vehicle 
      ? `${wo.vehicle.plate_number} - ${wo.vehicle.brand} ${wo.vehicle.model}`
      : undefined,
    type: wo.type as any,
    title: wo.title,
    description: wo.description || "",
    status: wo.status as any,
    priority: wo.priority as any,
    assigned_to: wo.assigned_to,
    assigned_to_name: wo.assigned_user 
      ? `${wo.assigned_user.first_name} ${wo.assigned_user.last_name}`
      : undefined,
    assignees: (wo.assignees || []).map(a => ({
      ...a,
      role: a.role as any // Cast string role to Role enum
    })),
    scheduled_date: wo.scheduled_date,
    completed_date: wo.completed_date,
    estimated_duration: wo.estimated_duration,
    category: wo.category,
    estimated_cost: wo.estimated_cost,
    actual_cost: wo.actual_cost,
    // notes: wo.notes,
    created_at: wo.created_at,
    updated_at: wo.updated_at,
    created_by: wo.created_by,
    vehicle: wo.vehicle,
    assigned_user: wo.assigned_user,
    cost: wo.cost, // Include cost data from backend
  }));

  return {
    data: transformedData,
    page: response.data.page,
    page_size: response.data.page_size,
    total: response.data.total_items,
  };
};
