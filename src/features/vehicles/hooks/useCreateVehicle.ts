import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVehicle } from "../api/createVehicle";
import { CreateVehicleDTO } from "../types/vehicle.types";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleDTO) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
