export const routes = {
  home: "/dashboard",
  dashboard: "/dashboard",
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
  },
  vehicles: {
    root: "/dashboard/vehicles",
    list: "/dashboard/vehicles",
    details: (id: string) => `/dashboard/vehicles/${id}`,
    edit: (id: string) => `/dashboard/vehicles/${id}/edit`,
  },
  workOrders: {
    root: "/dashboard/work-orders",
    list: "/dashboard/work-orders",
    details: (id: string) => `/dashboard/work-orders/${id}`,
  },
  inventory: {
    root: "/dashboard/inventory",
    list: "/dashboard/inventory",
  },
  parts: {
    root: "/dashboard/parts",
    list: "/dashboard/parts",
    details: (id: string) => `/dashboard/parts/${id}`,
  },
  maintenance: {
    root: "/dashboard/maintenance",
    list: "/dashboard/maintenance", // assuming maintenance landing page
  },
  reports: {
    root: "/dashboard/reports",
  },
  settings: {
    root: "/dashboard/settings",
    profile: "/dashboard/settings/profile",
    company: "/dashboard/settings/company",
    branding: "/dashboard/settings/branding",
    integrations: "/dashboard/settings/integrations",
    notifications: "/dashboard/settings/notifications",
    roles: "/dashboard/settings/roles",
  },
  users: {
    root: "/dashboard/users",
    list: "/dashboard/users",
    details: (id: string) => `/dashboard/users/${id}`,
  },
  notifications: {
     root: "/dashboard/notifications",
  }
};
