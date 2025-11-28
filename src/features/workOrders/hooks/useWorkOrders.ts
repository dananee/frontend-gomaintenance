import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkOrders, GetWorkOrdersParams } from "../api/getWorkOrders";
import { updateWorkOrder } from "../api/updateWorkOrder";
import { UpdateWorkOrderDTO } from "../types/workOrder.types";

export function useWorkOrders(params: GetWorkOrdersParams = {}) {
  return useQuery({
    queryKey: ["workOrders", params],
    queryFn: () => getWorkOrders(params),
  });
}

export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkOrderDTO) => updateWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
}
