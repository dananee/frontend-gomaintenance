import { useQuery } from "@tanstack/react-query";
import { getMotorcycles } from "../api/motorcycles.api";

interface UseMotorcyclesParams {
  status?: string;
  brand?: string;
  search?: string;
}

export function useMotorcycles(params: UseMotorcyclesParams = {}) {
  return useQuery({
    queryKey: ["motorcycles", params],
    queryFn: () => getMotorcycles(params),
  });
}
