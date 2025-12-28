export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";
export type WorkOrderStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";
export type WorkOrderType = "preventive" | "corrective" | "inspection";
export type TaskStatus = "todo" | "in_progress" | "done";

import { User } from "@/features/auth/types/auth.types";

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
  assignees?: User[]; // New field
  scheduled_date?: string;
  completed_date?: string;
  position?: number;
  estimated_duration?: number; // in hours
  category?: string;
  estimated_cost?: number;
  actual_cost?: number;
  mileage_at_service?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    license_plate: string;
  };
  assigned_user?: User; // Backward compatibility
  cost?: WorkOrderCost;
}

export interface WorkOrderCost {
  id: string;
  work_order_id: string;
  labor_cost: number;
  parts_cost: number;
  external_service_cost: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderBoardUpdateEvent {
  eventId: string;
  workspaceId: string;
  boardId: string;
  workOrderId: string;
  fromStatus: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  position: number;
  updatedAt: string;
  updatedBy: string;
  clientRequestId?: string;
  type: "work_order.updated";
}

export interface UpdateWorkOrderStatusRequest {
  status: WorkOrderStatus;
  position: number;
  boardId: string;
  clientRequestId: string;
}

// ... (keep existing interfaces)

export interface CreateWorkOrderDTO {
  vehicle_id: string;
  type: WorkOrderType;
  title: string;
  description?: string;
  priority?: WorkOrderPriority;
  assigned_to?: string;
  assignee_ids?: string[]; // New field
  scheduled_date?: string;
  estimated_duration?: number;
  category?: string;
  estimated_cost?: number;
  labor_cost?: number;
  external_service_cost?: number;
}

export interface UpdateWorkOrderDTO {
  id: string;
  title?: string;
  description?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  assigned_to?: string;
  assignee_ids?: string[]; // New field
  scheduled_date?: string;
  estimated_duration?: number;
  category?: string;
  estimated_cost?: number;
  actual_cost?: number;
  labor_cost?: number;
  external_service_cost?: number;
}
