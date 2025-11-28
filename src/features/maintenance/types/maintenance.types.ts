export type MaintenanceIntervalType = "distance" | "time" | "engine_hours";

export interface MaintenanceInterval {
  type: MaintenanceIntervalType;
  value: number;
  unit: string; // e.g., "km", "months", "hours"
}

export interface MaintenanceTemplate {
  id: string;
  name: string;
  description?: string;
  vehicle_types: string[]; // e.g., ["truck", "van"]
  intervals: MaintenanceInterval[];
  tasks: string[]; // List of tasks to be performed
  parts_required?: {
    part_id: string;
    quantity: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface MaintenancePlan {
  id: string;
  vehicle_id: string;
  template_id: string;
  last_performed_date?: string;
  last_performed_mileage?: number;
  next_due_date?: string;
  next_due_mileage?: number;
  status: "active" | "inactive" | "overdue";
  created_at: string;
}

export interface MaintenanceScheduleEvent {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  plan_id: string;
  template_name: string;
  due_date: string;
  status: "pending" | "overdue" | "scheduled" | "completed";
  priority: "low" | "medium" | "high" | "critical";
}
