import apiClient from "@/lib/api/axiosClient";
import { User } from "@/features/auth/types/auth.types";

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}`, data);
  return response.data;
};
