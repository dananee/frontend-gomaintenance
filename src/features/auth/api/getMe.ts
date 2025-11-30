import apiClient from "@/lib/api/axiosClient";
import { User } from "../types/auth.types";

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  const user = response.data;
  return {
    ...user,
    name: user.name || `${user.first_name} ${user.last_name}`.trim(),
  };
};
