import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, updateNotifications, NotificationPreferences, UpdateNotificationPreferencesRequest } from "@/services/settings/notificationsService";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useNotifications = () => {
    const queryClient = useQueryClient();
    const t = useTranslations("settings.notifications.toasts");

    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateNotificationPreferencesRequest) => updateNotifications(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            // Optimized optimistic update could be here, but simple invalidation is safer
            toast.success(t("updateSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("updateError"));
        },
    });

    return {
        notifications,
        isLoading,
        error,
        updateNotifications: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    };
};
