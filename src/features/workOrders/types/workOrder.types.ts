export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";
export type WorkOrderStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";
export type WorkOrderType = "preventive" | "corrective" | "inspection";
export type TaskStatus = "todo" | "in_progress" | "done";

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
  estimated_duration?: number; // in hours
  category?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ... (keep existing interfaces)

export interface CreateWorkOrderDTO {
  vehicle_id: string;
  type: WorkOrderType;
  title: string;
  description?: string;
  priority?: WorkOrderPriority;
  scheduled_date?: string;
  assigned_to?: string;
  estimated_duration?: number;
  category?: string;
  estimated_cost?: number;
  notes?: string;
}

export interface UpdateWorkOrderDTO {
  id: string;
  title?: string;
  description?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  assigned_to?: string;
  scheduled_date?: string;
  estimated_duration?: number;
  category?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
}
