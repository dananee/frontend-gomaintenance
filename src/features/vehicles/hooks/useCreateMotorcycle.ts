import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMotorcycle } from "../api/motorcycles.api";
import type { CreateMotorcycleDTO } from "../types/motorcycle.types";
import { useToast } from "@/hooks/useToast";

export const useCreateMotorcycle = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateMotorcycleDTO) => createMotorcycle(data),
    onSuccess: () => {
      // Invalidate vehicles query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      
      showSuccess("La moto a été créée avec succès");
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Impossible de créer la moto");
    },
  });
};
