
import { useQuery } from "@tanstack/react-query";
import { getVehicleTypes } from "../api/getVehicleTypes";

export const useVehicleTypes = () => {
  return useQuery({
    queryKey: ["vehicle-types-v2"],
    queryFn: getVehicleTypes,
    staleTime: 5 * 60 * 1000, // consider data fresh for 5 minutes
  });
};
