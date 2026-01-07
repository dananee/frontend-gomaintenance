import { useQuery } from "@tanstack/react-query";
import { getInventoryStats } from "../api/getParts";

export function useInventoryStats() {
  return useQuery({
    queryKey: ["inventory-stats"],
    queryFn: getInventoryStats,
  });
}
