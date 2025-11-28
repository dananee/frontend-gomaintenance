import apiClient from "@/lib/api/axiosClient";
import { LoginCredentials, LoginResponse } from "../types/auth.types";

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};
