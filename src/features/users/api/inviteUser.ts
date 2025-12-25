import apiClient from "@/lib/api/axiosClient";
import { Role } from "@/lib/rbac/permissions";

export interface InviteUserRequest {
  email: string;
  role: Role;
  language: string;
}

export async function inviteUser(data: InviteUserRequest) {
  const response = await apiClient.post("/users/invite", data);
  return response.data;
}
