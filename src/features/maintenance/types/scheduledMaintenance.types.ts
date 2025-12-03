import { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { User } from "@/features/users/types/user.types";
import { MaintenanceTemplate } from "./maintenanceTemplate.types";
import { WorkOrder } from "@/features/workOrders/types/workOrder.types";

export interface ScheduledMaintenance {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  template_id?: string;
  title: string;
  description: string;
  scheduled_date: string;
  priority: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  estimated_cost: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "converted_to_wo";
  work_order_id?: string;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  vehicle?: Vehicle;
  template?: MaintenanceTemplate;
  assigned_user?: User;
  created_user?: User;
  work_order?: WorkOrder;
}

export interface CreateScheduledMaintenanceRequest {
  vehicle_id: string;
  template_id?: string;
  title: string;
  description?: string;
  scheduled_date: string;
  priority: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  estimated_cost?: number;
  notes?: string;
}

export interface UpdateScheduledMaintenanceRequest {
  title: string;
  description?: string;
  scheduled_date: string;
  priority: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  estimated_cost?: number;
  notes?: string;
}

export interface ScheduledMaintenanceFilters {
  status?: string;
  vehicle_id?: string;
}
