export type Role = "admin" | "mechanic" | "driver" | "supervisor";

export type Permission =
  | "manage_users"
  | "view_users"
  | "manage_vehicles"
  | "view_vehicles"
  | "manage_work_orders"
  | "view_work_orders"
  | "complete_tasks"
  | "manage_inventory"
  | "view_inventory"
  | "view_reports"
  | "manage_reports"
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
  ],
  supervisor: [
    "view_users",
    "manage_vehicles",
    "view_vehicles",
    "manage_work_orders",
    "view_work_orders",
    "view_inventory",
    "view_reports",
    "view_costs",
  ],
  mechanic: [
    "view_vehicles",
    "view_work_orders",
    "complete_tasks",
    "view_inventory",
  ],
  driver: ["view_vehicles", "report_incident"],
};
