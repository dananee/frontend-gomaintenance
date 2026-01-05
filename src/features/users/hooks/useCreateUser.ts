import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, CreateUserRequest } from "../api/createUser";
import { Role } from "@/lib/rbac/permissions";

interface CreateUserParams {
  first_name: string;
  last_name: string;
  email?: string;
  role: Role;
  status: "active" | "inactive";
  phone?: string;
  department?: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ first_name, last_name, email, role, status, phone, department }: CreateUserParams) => {
      const request: CreateUserRequest = {
        email: email || "",
        first_name,
        last_name,
        role,
        phone: phone || "",
        department: department || "",
        password: "TemporaryPassword123!", // Backend requires a password for direct creation
      };

      return createUser(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
