import { Role } from "@/lib/rbac/permissions";

interface AccessRule {
  pattern: RegExp;
  roles: Role[];
}

const routeAccessRules: AccessRule[] = [
  {
    pattern: /^\/dashboard\/?$/, // dashboard overview
    roles: ["admin", "manager", "technician", "viewer"],
  },
  {
    pattern: /^\/dashboard\/users/,
    roles: ["admin"],
  },
  {
    pattern: /^\/dashboard\/reports/,
    roles: ["admin", "manager"],
  },
  {
    pattern: /^\/dashboard\/work-orders/,
    roles: ["admin", "manager", "technician"],
  },
  {
    pattern: /^\/dashboard\/inventory/,
    roles: ["admin", "manager"],
  },
  {
    pattern: /^\/dashboard\/vehicles/,
    roles: ["admin", "manager", "viewer", "technician"],
  },
  {
    pattern: /^\/dashboard\//,
    roles: ["admin"],
  },
];

export function isRouteAllowed(pathname: string, role: Role | undefined): boolean {
  if (!role) return false;

  const normalizedPath = pathname || "/";
  const matchingRule = routeAccessRules.find((rule) => rule.pattern.test(normalizedPath));

  if (!matchingRule) {
    return role === "admin"; // fallback: only admins can access unlisted dashboard routes
  }

  return matchingRule.roles.includes(role);
}
