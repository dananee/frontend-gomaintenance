export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";
export type WorkOrderStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type WorkOrderType = "preventive" | "corrective" | "inspection";

export interface WorkOrder {
  id: string;
  vehicle_id: string;
  vehicle_name?: string; // Optional, might need to be joined
  type: WorkOrderType;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assigned_to?: string;
  assigned_to_name?: string;
  scheduled_date?: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkOrderDTO {
  vehicle_id: string;
  type: WorkOrderType;
  title: string;
  description?: string;
  priority?: WorkOrderPriority;
  scheduled_date?: string;
}

export interface UpdateWorkOrderDTO {
  id: string;
  title?: string;
  description?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
}
