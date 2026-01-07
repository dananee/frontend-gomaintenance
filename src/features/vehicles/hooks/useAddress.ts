import { useQuery } from "@tanstack/react-query";
import { getRegions, getVilles } from "../api/address";

export const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
  });
};

export const useVilles = (regionId?: number) => {
  return useQuery({
    queryKey: ["villes", regionId],
    queryFn: () => getVilles(regionId),
    enabled: !!regionId,
  });
};
