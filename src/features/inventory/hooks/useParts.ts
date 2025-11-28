import { useQuery } from "@tanstack/react-query";
import { getParts, GetPartsParams } from "../api/getParts";

export function useParts(params: GetPartsParams = {}) {
  return useQuery({
    queryKey: ["parts", params],
    queryFn: () => getParts(params),
  });
}
