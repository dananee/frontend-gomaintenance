import { useQuery } from "@tanstack/react-query";
import { getEventById } from "../api/maintenanceEvents";
import { EventDetails } from "../types/maintenanceDashboard.types";

/**
 * Hook to fetch a single maintenance event by ID
 */
export const useMaintenanceEvent = (eventId: string | null) => {
  return useQuery<EventDetails>({
    queryKey: ["maintenance", "event", eventId],
    queryFn: () => getEventById(eventId!),
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
