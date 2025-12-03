export interface User {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "manager" | "technician" | "viewer";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "admin" | "manager" | "technician" | "viewer";
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: "admin" | "manager" | "technician" | "viewer";
  is_active?: boolean;
}
