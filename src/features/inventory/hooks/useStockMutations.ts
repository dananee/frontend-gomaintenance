import { useMutation, useQueryClient } from "@tanstack/react-query";
import { receiveStock } from "../api/receiveStock";
import { ReceiveStockRequest } from "../types/inventory.types";
import { toast } from "sonner";

export function useReceiveStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReceiveStockRequest) => receiveStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.success("Stock added with success", {
        description: "The reception has been recorded and available stock updated.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to receive stock", {
        description: error?.response?.data?.error || "An error occurred during reception.",
      });
    },
  });
}
