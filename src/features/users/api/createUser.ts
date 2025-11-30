import apiClient from "@/lib/api/axiosClient";
import { User } from "@/features/auth/types/auth.types";
import { Role } from "@/lib/rbac/permissions";

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: Role;
}

export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const response = await apiClient.post<User>("/users", data);
  return response.data;
};
