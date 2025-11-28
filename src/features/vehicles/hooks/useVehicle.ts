import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "../api/getVehicle";

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicle(id),
    enabled: !!id,
  });
}
