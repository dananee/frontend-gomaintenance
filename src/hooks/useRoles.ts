import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, getRole, updateRolePermissions, createRole, deleteRole, Role } from "@/services/settings/rolesService";
import { toast } from "sonner";

export const useRoles = () => {
    const queryClient = useQueryClient();

    const { data: roles, isLoading, error } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string; description: string }) => createRole(data.name, data.description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast("Role created successfully");
        },
        onError: () => toast("Failed to create role"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast("Role deleted successfully");
        },
        onError: () => toast("Failed to delete role"),
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
            toast.success("Role permissions updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update permissions");
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
