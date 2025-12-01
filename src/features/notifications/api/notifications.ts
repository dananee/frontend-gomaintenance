import apiClient from "@/lib/api/axiosClient";
import { Notification } from "../types/notification.types";

export interface GetNotificationsParams {
  page?: number;
  page_size?: number;
}

export interface GetNotificationsResponse {
  data: Notification[];
  page: number;
  page_size: number;
  total: number;
}

export const getNotifications = async (params: GetNotificationsParams = {}): Promise<GetNotificationsResponse> => {
  const response = await apiClient.get<GetNotificationsResponse>("/notifications", { params });
  return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.post("/notifications/mark-all-read");
};
