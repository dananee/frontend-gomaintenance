import apiClient from "@/lib/api/axiosClient";
import { LoginCredentials, LoginResponse } from "../types/auth.types";

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
  const user = response.data.user;
  return {
    ...response.data,
    user: {
      ...user,
      name: user.name || `${user.first_name} ${user.last_name}`.trim(),
    },
  };
};
