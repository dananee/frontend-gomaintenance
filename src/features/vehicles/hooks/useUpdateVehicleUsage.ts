import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVehicleUsage, UpdateVehicleUsageRequest } from "../api/updateVehicleUsage";

export const useUpdateVehicleUsage = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateVehicleUsageRequest) =>
      updateVehicleUsage(vehicleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-details", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
    },
  });
};
