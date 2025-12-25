import apiClient from "@/lib/api/axiosClient";

export interface UserStats {
  completed_work_orders: number;
  active_work_orders: number;
  pending_work_orders: number;
  participation_rate: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  const response = await apiClient.get<UserStats>("/users/me/stats");
  return response.data;
};
