import { Role } from "@/lib/rbac/permissions";

export interface User {
  id: string;
  tenant_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_active?: boolean;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
