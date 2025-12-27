export interface ScheduledMaintenanceEvent {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  title: string;
  description?: string;
  scheduled_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  technician?: string;
  estimated_cost?: number;
  notes?: string;
  work_order_id?: string;
  template_id?: string;
}

export interface ActiveMaintenancePlan {
  id: string;
  vehicle_id: string;
  template_id: string;
  is_active: boolean;
  status?: "active" | "inactive" | "overdue";
  created_at: string;
  vehicle: {
    id: string;
    plate_number: string;
    brand: string;
    model: string;
    type: string;
  };
  template: {
    id: string;
    name: string;
    interval_km?: number;
    interval_days?: number;
    interval_hours?: number;
  };
  next_due_date?: string;
  next_due_mileage?: number;
}

export interface GetScheduledMaintenanceParams {
  start_date?: string;
  end_date?: string;
  assets?: string[];
  categories?: string[];
  technicians?: string[];
  statuses?: string[];
  recurrence?: string;
}

export interface EventDetails extends ScheduledMaintenanceEvent {
  description?: string;
  notes?: string;
  work_order_id?: string;
  template_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export type PlanAction = "run_now" | "pause" | "resume" | "delete" | "edit";

export interface UpdateEventData {
  title?: string;
  description?: string;
  scheduled_date?: string;
  priority?: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  estimated_cost?: number;
  notes?: string;
}

export interface UpdatePlanData {
  is_active?: boolean;
  next_due_date?: string;
  next_due_mileage?: number;
}
