import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listWorkOrderParts, addWorkOrderPart, removeWorkOrderPart, AddWorkOrderPartRequest } from "../api/workOrderParts";
import { toast } from "sonner";

export const useWorkOrderParts = (workOrderId: string) => {
  return useQuery({
    queryKey: ["workOrderParts", workOrderId],
    queryFn: () => listWorkOrderParts(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useAddWorkOrderPart = (workOrderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddWorkOrderPartRequest) => addWorkOrderPart(workOrderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderParts", workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.success("Part added to work order");
    },
    onError: (err: any) => {
        toast.error("Failed to add part", {
            description: err?.response?.data?.error || "An error occurred"
        });
    }
  });
};

export const useRemoveWorkOrderPart = (workOrderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (partUseId: string) => removeWorkOrderPart(workOrderId, partUseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderParts", workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.success("Part removed from work order");
    },
  });
};
