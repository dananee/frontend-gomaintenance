import apiClient from "@/lib/api/axiosClient";
import { User } from "../types/auth.types";

export interface RegisterRequest {
  tenant_name: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>("/auth/register", data);
  const user = response.data.user;
  return {
    ...response.data,
    user: {
      ...user,
      name: user.name || `${user.first_name} ${user.last_name}`.trim(),
    },
  };
};
