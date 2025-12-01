import { useQuery } from "@tanstack/react-query";
import { getVehicleKPIs, getVehicleHealthScore } from "../api/getVehicleKPIs";

export function useVehicleKPIs(vehicleId: string) {
  return useQuery({
    queryKey: ["vehicle-kpis", vehicleId],
    queryFn: () => getVehicleKPIs(vehicleId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!vehicleId,
  });
}

export function useVehicleHealthScore(vehicleId: string) {
  return useQuery({
    queryKey: ["vehicle-health-score", vehicleId],
    queryFn: () => getVehicleHealthScore(vehicleId),
    staleTime: 1000 * 60 * 5,
    enabled: !!vehicleId,
  });
}
