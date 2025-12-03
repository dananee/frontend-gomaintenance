export type Role = "admin" | "manager" | "technician" | "viewer";

export type Permission =
  | "view_dashboard"
  | "view_vehicles"
  | "edit_vehicles"
  | "manage_vehicles"
  | "view_work_orders"
  | "create_work_orders"
  | "edit_work_orders"
  | "manage_work_orders"
  | "complete_tasks"
  | "view_inventory"
  | "manage_inventory"
  | "view_users"
  | "manage_users"
  | "view_reports"
  | "manage_reports"
  | "view_maintenance"
  | "manage_maintenance"
  | "report_incident"
  | "view_costs";

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "manage_users",
    "view_users",
    "manage_vehicles",
    "view_vehicles",
    "manage_work_orders",
    "view_work_orders",
    "manage_inventory",
    "view_inventory",
    "view_reports",
    "manage_reports",
    "view_costs",
    "view_maintenance",
    "manage_maintenance",
  ],
  manager: [
    "view_users",
    "manage_vehicles",
    "view_vehicles",
    "manage_work_orders",
    "view_work_orders",
    "manage_inventory",
    "view_inventory",
    "view_reports",
    "view_costs",
    "view_maintenance",
    "manage_maintenance",
  ],
  technician: [
    "view_vehicles",
    "view_work_orders",
    "complete_tasks",
    "view_inventory",
  ],
  viewer: ["view_dashboard", "view_vehicles", "view_work_orders"],
};
