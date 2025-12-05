import apiClient from "@/lib/api/axiosClient";
import { LoginCredentials, LoginResponse } from "../types/auth.types";

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", credentials);

  // Validate response structure
  if (!response.data) {
    console.error("Login response missing data:", response);
    throw new Error("Invalid response from server");
  }

  if (!response.data.token) {
    console.error("Login response missing token:", response.data);
    throw new Error("Authentication failed: No token received");
  }

  if (!response.data.user) {
    console.error("Login response missing user:", response.data);
    throw new Error("Authentication failed: No user data received");
  }

  const user = response.data.user;
  console.log("Login successful, token received:", response.data.token.substring(0, 20) + "...");

  return {
    ...response.data,
    user: {
      ...user,
      name: user.name || `${user.first_name} ${user.last_name}`.trim(),
    },
  };
};
