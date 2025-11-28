import apiClient from "@/lib/api/axiosClient";
import { LoginResponse } from "../types/auth.types";

export const refreshToken = async (
  token: string
): Promise<Pick<LoginResponse, "token" | "refreshToken" | "user">> => {
  const response = await apiClient.post<Pick<LoginResponse, "token" | "refreshToken" | "user">>(
    "/auth/refresh",
    { refreshToken: token }
  );
  return response.data;
};
