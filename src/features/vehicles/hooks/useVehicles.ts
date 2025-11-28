import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getVehicles, GetVehiclesParams } from "../api/getVehicles";

export function useVehicles(params: GetVehiclesParams = {}) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => getVehicles(params),
    placeholderData: keepPreviousData,
  });
}
