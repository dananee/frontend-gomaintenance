import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getScheduledMaintenances,
  getScheduledMaintenance,
  createScheduledMaintenance,
  updateScheduledMaintenance,
  deleteScheduledMaintenance,
  convertToWorkOrder,
} from "../api/scheduledMaintenance";
import {
  CreateScheduledMaintenanceRequest,
  UpdateScheduledMaintenanceRequest,
  ScheduledMaintenanceFilters,
} from "../types/scheduledMaintenance.types";

export const useScheduledMaintenances = (filters?: ScheduledMaintenanceFilters) => {
  return useQuery({
    queryKey: ["scheduled-maintenance", filters],
    queryFn: () => getScheduledMaintenances(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useScheduledMaintenance = (id: string) => {
  return useQuery({
    queryKey: ["scheduled-maintenance", id],
    queryFn: () => getScheduledMaintenance(id),
    enabled: !!id,
  });
};

export const useCreateScheduledMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduledMaintenanceRequest) =>
      createScheduledMaintenance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
    },
  });
};

export const useUpdateScheduledMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduledMaintenanceRequest }) =>
      updateScheduledMaintenance(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["scheduled-maintenance", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
    },
  });
};

export const useDeleteScheduledMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteScheduledMaintenance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
    },
  });
};

export const useConvertToWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => convertToWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
};
