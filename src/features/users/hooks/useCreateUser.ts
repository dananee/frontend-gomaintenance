import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, CreateUserRequest } from "../api/createUser";
import { Role } from "@/lib/rbac/permissions";

interface CreateUserParams {
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, role, status }: CreateUserParams) => {
      // Split name into first and last name
      const nameParts = name.trim().split(/\s+/);
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || " ";

      const request: CreateUserRequest = {
        email,
        first_name,
        last_name,
        role,
        password: "TemporaryPassword123!", // Backend requires a password for direct creation
      };

      return createUser(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
