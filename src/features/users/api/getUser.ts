import apiClient from "@/lib/api/axiosClient";
import { User } from "@/features/auth/types/auth.types";

export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  const user = response.data;
  return {
    ...user,
    name: user.name || `${user.first_name} ${user.last_name}`.trim(),
  };
};
