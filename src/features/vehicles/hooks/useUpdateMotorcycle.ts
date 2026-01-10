import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMotorcycle } from "../api/motorcycles.api";
import type { UpdateMotorcycleDTO } from "../types/motorcycle.types";
import { useToast } from "@/hooks/useToast";

export const useUpdateMotorcycle = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateMotorcycleDTO) => updateMotorcycle(data),
    onSuccess: () => {
      // Invalidate vehicles query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      
      showSuccess("La moto a été mise à jour avec succès");
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Impossible de mettre à jour la moto");
    },
  });
};
