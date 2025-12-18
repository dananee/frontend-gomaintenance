import apiClient from "@/lib/api/axiosClient";

export interface NotificationPreferences {
    work_order_updates: boolean;
    low_stock_alerts: boolean;
    maintenance_reminders: boolean;
    realtime_alerts: boolean;
}

export interface UpdateNotificationPreferencesRequest {
    work_order_updates?: boolean;
    low_stock_alerts?: boolean;
    maintenance_reminders?: boolean;
    realtime_alerts?: boolean;
}

export const getNotifications = async (): Promise<NotificationPreferences> => {
    const response = await apiClient.get("/settings/notifications");
    return response.data;
};

export const updateNotifications = async (data: UpdateNotificationPreferencesRequest): Promise<NotificationPreferences> => {
    const response = await apiClient.put("/settings/notifications", data);
    return response.data;
};
