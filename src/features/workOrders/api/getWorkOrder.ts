import apiClient from "@/lib/api/axiosClient";
import { WorkOrder } from "../types/workOrder.types";

export const getWorkOrder = async (id: string): Promise<WorkOrder> => {
  const response = await apiClient.get(`/work-orders/${id}`);
  const wo = response.data;
  
  // Transform backend response to match frontend WorkOrder type
  return {
    id: wo.id,
    vehicle_id: wo.vehicle_id,
    vehicle_name: wo.vehicle 
      ? `${wo.vehicle.plate_number} - ${wo.vehicle.brand} ${wo.vehicle.model}`
      : undefined,
    type: wo.type,
    title: wo.title,
    description: wo.description || "",
    status: wo.status,
    priority: wo.priority,
    assigned_to: wo.assigned_to,
    assigned_to_name: wo.created_user?.first_name && wo.created_user?.last_name
      ? `${wo.created_user.first_name} ${wo.created_user.last_name}`
      : undefined,
    scheduled_date: wo.scheduled_date,
    completed_date: wo.completed_date,
    estimated_duration: wo.estimated_duration,
    category: wo.category,
    estimated_cost: wo.estimated_cost,
    actual_cost: wo.actual_cost,
    notes: wo.notes,
    created_at: wo.created_at,
    updated_at: wo.updated_at,
  };
};
