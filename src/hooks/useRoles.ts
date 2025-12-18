import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, getRole, updateRolePermissions, createRole, deleteRole, Role } from "@/services/settings/rolesService";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useRoles = () => {
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();

    const { data: roles, isLoading, error } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string; description: string }) => createRole(data.name, data.description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success(t("success.roleCreated"));
        },
        onError: () => toast.error(t("error.roleCreateFailed")),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success(t("success.roleDeleted"));
        },
        onError: () => toast.error(t("error.roleDeleteFailed")),
    });

    return {
        roles,
        isLoading,
        error,
        createRole: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        deleteRole: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};

export const useRole = (roleName: string) => {
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();

    const { data: role, isLoading, error } = useQuery({
        queryKey: ["roles", roleName],
        queryFn: () => getRole(roleName),
        enabled: !!roleName,
    });

    const updatePermissionsMutation = useMutation({
        mutationFn: (permissions: Record<string, string[]>) => updateRolePermissions(roleName, permissions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            queryClient.invalidateQueries({ queryKey: ["roles", roleName] });
            toast.success(t("success.rolePermissionsUpdated"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("error.rolePermissionsUpdateFailed"));
        },
    });

    return {
        role,
        isLoading,
        error,
        updatePermissions: updatePermissionsMutation.mutateAsync,
        isUpdating: updatePermissionsMutation.isPending,
    };
};
