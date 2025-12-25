import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, UpdateUserRequest } from "../api/updateUser";
import { changeUserRole } from "../api/changeUserRole";
import { Role } from "@/lib/rbac/permissions";
import { UserRecord } from "../store/useUsersStore";

interface UpdateUserParams {
  id: string;
  updates: Partial<UserRecord>;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateUserParams) => {
      const updateData: UpdateUserRequest = {};

      if (updates.name) {
        const nameParts = updates.name.trim().split(/\s+/);
        updateData.first_name = nameParts[0];
        updateData.last_name = nameParts.slice(1).join(" ") || " ";
      }

      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.status) updateData.is_active = updates.status === "active";

      // 1. Update basic info
      await updateUser(id, updateData);

      // 2. Update role if changed (using separate endpoint as per backend design)
      if (updates.role) {
        await changeUserRole(id, updates.role);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
