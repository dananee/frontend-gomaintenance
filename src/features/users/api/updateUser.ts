import apiClient from "@/lib/api/axiosClient";
import { User } from "@/features/auth/types/auth.types";

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
  job_title?: string;
  sites?: string;
  shift?: string;
  is_active?: boolean;
}

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}`, data);
  return response.data;
};
