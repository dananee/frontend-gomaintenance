export interface Department {
  id: string;
  tenant_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentDTO {
  name: string;
}

export interface UpdateDepartmentDTO {
  name: string;
}
