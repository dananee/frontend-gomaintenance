import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkOrder } from "../api/createWorkOrder";
import { CreateWorkOrderDTO } from "../types/workOrder.types";

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkOrderDTO) => createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
}
