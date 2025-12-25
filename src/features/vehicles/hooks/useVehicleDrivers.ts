import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVehicleDrivers,
  assignDrivers,
  unassignDriver,
  updateDriverAssignment,
} from "../api/drivers";
import { AssignDriversRequest, UpdateDriverAssignmentRequest } from "../types/driver";

export const useVehicleDrivers = (vehicleId: string) => {
  return useQuery({
    queryKey: ["vehicle-drivers", vehicleId],
    queryFn: () => getVehicleDrivers(vehicleId),
    enabled: !!vehicleId,
  });
};

export const useAssignDrivers = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignDriversRequest) => assignDrivers(vehicleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-drivers", vehicleId] });
    },
  });
};

export const useUnassignDriver = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driverId: string) => unassignDriver(vehicleId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-drivers", vehicleId] });
    },
  });
};

export const useSetPrimaryDriver = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driverId: string) =>
      updateDriverAssignment(vehicleId, driverId, { is_primary: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-drivers", vehicleId] });
    },
  });
};
