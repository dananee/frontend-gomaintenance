import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, GetNotificationsParams } from "../api/notifications";
import { Notification } from "../types/notification.types";
import { useWebSocket } from "@/hooks/useWebSocket";

export function useNotifications(params?: GetNotificationsParams) {
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();
  const [realtimeNotifications, setRealtimeNotifications] = useState<Notification[]>([]);

  const query = useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    staleTime: 1000 * 60, // 1 minute
  });

  // Subscribe to WebSocket notifications
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "notification.new") {
          // Add new notification to the top
          setRealtimeNotifications((prev) => [message.notification, ...prev]);
          
          // Invalidate query to refetch
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } else if (message.type === "notification.read" || message.type === "notification.deleted") {
          // Invalidate query to refetch
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    });

    return unsubscribe;
  }, [subscribe, queryClient]);

  // Merge realtime and fetched notifications
  const allNotifications = [...realtimeNotifications, ...(query.data?.data || [])];
  
  // Remove duplicates based on ID
  const uniqueNotifications = allNotifications.filter(
    (notification, index, self) =>
      index === self.findIndex((n) => n.id === notification.id)
  );

  return {
    ...query,
    data: query.data ? { ...query.data, data: uniqueNotifications } : undefined,
  };
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
