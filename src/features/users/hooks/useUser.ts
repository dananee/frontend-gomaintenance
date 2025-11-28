import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/getUser";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}
