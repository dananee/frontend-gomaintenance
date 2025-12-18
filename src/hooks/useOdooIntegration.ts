import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getOdooStatus,
    connectOdoo,
    testOdooConnection,
    disconnectOdoo,
    ConnectOdooRequest
} from "@/services/integrations/odooService";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useOdooIntegration = () => {
    const queryClient = useQueryClient();
    const t = useTranslations("settings.integrations.odoo.toasts");

    const { data: status, isLoading, error } = useQuery({
        queryKey: ["odoo-status"],
        queryFn: getOdooStatus,
    });

    const connectMutation = useMutation({
        mutationFn: (data: ConnectOdooRequest) => connectOdoo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["odoo-status"] });
            toast.success(t("connectSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("connectError"));
        },
    });

    const testConnectionMutation = useMutation({
        mutationFn: testOdooConnection,
        onSuccess: (data) => {
            toast.success(t("testSuccess", { latency: data.latency }));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("testError"));
        },
    });

    const disconnectMutation = useMutation({
        mutationFn: disconnectOdoo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["odoo-status"] });
            toast.success(t("disconnectSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("disconnectError"));
        },
    });

    return {
        status,
        isLoading,
        error,
        connect: connectMutation.mutateAsync,
        isConnecting: connectMutation.isPending,
        testConnection: testConnectionMutation.mutateAsync,
        isTesting: testConnectionMutation.isPending,
        disconnect: disconnectMutation.mutateAsync,
        isDisconnecting: disconnectMutation.isPending,
    };
};
