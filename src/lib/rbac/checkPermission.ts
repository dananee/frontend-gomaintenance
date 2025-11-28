import { useAuthStore } from "@/store/useAuthStore";
import { Permission, rolePermissions } from "./permissions";

/**
 * Check if the current user has a specific permission
 */
export function checkPermission(permission: Permission): boolean {
  const user = useAuthStore.getState().user;
  
  if (!user || !user.role) {
    return false;
  }

  const permissions = rolePermissions[user.role];
  return permissions.includes(permission);
}

/**
 * React hook to check permissions
 */
export function usePermission(permission: Permission): boolean {
  const user = useAuthStore((state) => state.user);

  if (!user || !user.role) {
    return false;
  }

  const permissions = rolePermissions[user.role];
  return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(permissions: Permission[]): boolean {
  return permissions.some((permission) => checkPermission(permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(permissions: Permission[]): boolean {
  return permissions.every((permission) => checkPermission(permission));
}
