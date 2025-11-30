import apiClient from "@/lib/api/axiosClient";
import { User } from "@/features/auth/types/auth.types";
import { Role } from "@/lib/rbac/permissions";

export interface ChangeUserRoleRequest {
  role: Role;
}

export const changeUserRole = async (id: string, role: Role): Promise<User> => {
  const response = await apiClient.patch<User>(`/users/${id}/role`, { role });
  return response.data;
};
