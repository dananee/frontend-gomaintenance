import { useQuery } from "@tanstack/react-query";
import { getPart } from "../api/getPart";

export function usePart(id: string) {
  return useQuery({
    queryKey: ["part", id],
    queryFn: () => getPart(id),
    enabled: !!id,
  });
}
