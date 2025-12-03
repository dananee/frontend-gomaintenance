import apiClient from "@/lib/api/axiosClient";
import {
  MaintenanceTemplate,
  CreateMaintenanceTemplateDTO,
  UpdateMaintenanceTemplateDTO,
  GetMaintenanceTemplatesParams,
  GetMaintenanceTemplatesResponse,
} from "../types/maintenanceTemplate.types";

export const getMaintenanceTemplates = async (
  params: GetMaintenanceTemplatesParams = {}
): Promise<GetMaintenanceTemplatesResponse> => {
  const response = await apiClient.get<GetMaintenanceTemplatesResponse>(
    "/maintenance/templates",
    { params }
  );
  return response.data;
};

export const getMaintenanceTemplate = async (
  id: string
): Promise<MaintenanceTemplate> => {
  const response = await apiClient.get<MaintenanceTemplate>(
    `/maintenance/templates/${id}`
  );
  return response.data;
};

export const createMaintenanceTemplate = async (
  data: CreateMaintenanceTemplateDTO
): Promise<MaintenanceTemplate> => {
  const response = await apiClient.post<MaintenanceTemplate>(
    "/maintenance/templates",
    data
  );
  return response.data;
};

export const updateMaintenanceTemplate = async (
  id: string,
  data: Partial<CreateMaintenanceTemplateDTO>
): Promise<MaintenanceTemplate> => {
  const response = await apiClient.put<MaintenanceTemplate>(
    `/maintenance/templates/${id}`,
    data
  );
  return response.data;
};

export const deleteMaintenanceTemplate = async (id: string): Promise<void> => {
  await apiClient.delete(`/maintenance/templates/${id}`);
};
