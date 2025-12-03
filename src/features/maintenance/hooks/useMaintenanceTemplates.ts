import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMaintenanceTemplates,
  getMaintenanceTemplate,
  createMaintenanceTemplate,
  updateMaintenanceTemplate,
  deleteMaintenanceTemplate,
} from "../api/maintenanceTemplates";
import {
  GetMaintenanceTemplatesParams,
  CreateMaintenanceTemplateDTO,
} from "../types/maintenanceTemplate.types";

export const useMaintenanceTemplates = (
  params: GetMaintenanceTemplatesParams = {}
) => {
  return useQuery({
    queryKey: ["maintenance-templates", params],
    queryFn: () => getMaintenanceTemplates(params),
  });
};

export const useMaintenanceTemplate = (id: string) => {
  return useQuery({
    queryKey: ["maintenance-template", id],
    queryFn: () => getMaintenanceTemplate(id),
    enabled: !!id,
  });
};

export const useCreateMaintenanceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMaintenanceTemplateDTO) =>
      createMaintenanceTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-templates"] });
    },
  });
};

export const useUpdateMaintenanceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateMaintenanceTemplateDTO>;
    }) => updateMaintenanceTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-templates"] });
    },
  });
};

export const useDeleteMaintenanceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteMaintenanceTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-templates"] });
    },
  });
};
