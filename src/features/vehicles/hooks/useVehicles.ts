import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getVehicles, GetVehiclesParams } from "../api/getVehicles";

export function useVehicles(params: GetVehiclesParams = { page: 1, page_size: 100 }) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => getVehicles(params),
    placeholderData: keepPreviousData,
  });
}
