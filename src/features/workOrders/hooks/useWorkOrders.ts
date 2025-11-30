import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkOrders, GetWorkOrdersParams } from "../api/getWorkOrders";
import { updateWorkOrder } from "../api/updateWorkOrder";
import { deleteWorkOrder } from "../api/deleteWorkOrder";
import { updateWorkOrderStatus } from "../api/updateWorkOrderStatus";
import { UpdateWorkOrderDTO, WorkOrderStatus } from "../types/workOrder.types";

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

export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
}

export function useUpdateWorkOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: WorkOrderStatus }) =>
      updateWorkOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
}
