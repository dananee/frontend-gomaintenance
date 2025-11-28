import { useQuery } from "@tanstack/react-query";
import { getWorkOrder } from "../api/getWorkOrder";

export function useWorkOrder(id: string) {
  return useQuery({
    queryKey: ["workOrder", id],
    queryFn: () => getWorkOrder(id),
    enabled: !!id,
  });
}
