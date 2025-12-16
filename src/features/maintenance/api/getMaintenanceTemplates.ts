import { apiClient } from "@/lib/api/axiosClient";

export interface MaintenanceTemplate {
  id: string;
  name: string;
  description: string;
  interval_km?: number;
  interval_days?: number;
  interval_hours?: number;
  tasks: string[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTemplatesResponse {
  data: MaintenanceTemplate[];
  page: number;
  page_size: number;
  total: number;
}

export const getMaintenanceTemplates = async (
  page: number = 1,
  pageSize: number = 50
): Promise<MaintenanceTemplatesResponse> => {
  const response = await apiClient.get("/maintenance/templates", {
    params: { page, page_size: pageSize },
  });
  return response.data;
};
