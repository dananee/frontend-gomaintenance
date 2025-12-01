import { useQuery } from "@tanstack/react-query";
import { getDashboardKPIs } from "../api/getDashboardKPIs";

export const useDashboardKPIs = () => {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: getDashboardKPIs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
};
