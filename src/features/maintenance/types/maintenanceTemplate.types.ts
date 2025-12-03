export interface MaintenanceTemplate {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  interval_km?: number | null;
  interval_days?: number | null;
  interval_hours?: number | null;
  tasks: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateMaintenanceTemplateDTO {
  name: string;
  description: string;
  interval_km?: number;
  interval_days?: number;
  interval_hours?: number;
  tasks: string[];
}

export interface UpdateMaintenanceTemplateDTO extends Partial<CreateMaintenanceTemplateDTO> {
  id: string;
}

export interface GetMaintenanceTemplatesParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface GetMaintenanceTemplatesResponse {
  data: MaintenanceTemplate[];
  page: number;
  page_size: number;
  total: number;
}
