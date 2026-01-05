import apiClient from "@/lib/api/axiosClient";
import { User } from "@/features/auth/types/auth.types";

export interface CheckUserExistsParams {
  first_name: string;
  last_name: string;
}

export interface CheckUserExistsResponse {
  exists: boolean;
  users: User[];
}

export const checkUserExists = async (params: CheckUserExistsParams): Promise<CheckUserExistsResponse> => {
  const response = await apiClient.get<CheckUserExistsResponse>("/users/check-exists", { params });
  return response.data;
};
