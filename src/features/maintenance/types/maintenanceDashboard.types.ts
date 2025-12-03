export interface ScheduledMaintenanceEvent {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  title: string;
  scheduled_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  estimated_cost?: number;
}

export interface ActiveMaintenancePlan {
  id: string;
  vehicle_id: string;
  template_id: string;
  status: "active" | "inactive" | "overdue";
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
}
