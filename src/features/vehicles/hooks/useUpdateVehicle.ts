import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVehicle } from "../api/updateVehicle";
import { toast } from "sonner";

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVehicle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", data.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-details", data.id] });
      toast.success("Vehicle updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to update vehicle");
    },
  });
}
