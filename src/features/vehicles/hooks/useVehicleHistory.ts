import { useQuery } from "@tanstack/react-query";
import { getVehicleHistory, HistoryEvent } from "../api/getVehicleHistory";

export const useVehicleHistory = (vehicleId: string) => {
  return useQuery<HistoryEvent[]>({
    queryKey: ["vehicle-history", vehicleId],
    queryFn: () => getVehicleHistory(vehicleId),
    enabled: !!vehicleId,
  });
};
