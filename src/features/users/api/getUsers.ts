import apiClient from "@/lib/api/axiosClient";
import { User } from "@/features/auth/types/auth.types";

export interface GetUsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
}

export interface GetUsersResponse {
  data: User[];
  page: number;
  page_size: number;
  total: number;
}

export const getUsers = async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
  const response = await apiClient.get<GetUsersResponse>("/users", { params });
  return response.data;
};
