import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVehicleMaintenancePlans,
  createVehicleMaintenancePlan,
  updateVehicleMaintenancePlan,
  deleteVehicleMaintenancePlan,
  CreateMaintenancePlanRequest,
} from "../api/vehiclePlans";

export const useVehicleMaintenancePlans = (vehicleId: string) => {
  return useQuery({
    queryKey: ["vehicle-maintenance-plans", vehicleId],
    queryFn: () => getVehicleMaintenancePlans(vehicleId),
    enabled: !!vehicleId,
  });
};

export const useCreateVehicleMaintenancePlan = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaintenancePlanRequest) =>
      createVehicleMaintenancePlan(vehicleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-maintenance-plans", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans", "active"] });
    },
  });
};

export const useUpdateVehicleMaintenancePlan = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: CreateMaintenancePlanRequest }) =>
      updateVehicleMaintenancePlan(vehicleId, planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-maintenance-plans", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans", "active"] });
    },
  });
};

export const useDeleteVehicleMaintenancePlan = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => deleteVehicleMaintenancePlan(vehicleId, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-maintenance-plans", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans", "active"] });
    },
  });
};
