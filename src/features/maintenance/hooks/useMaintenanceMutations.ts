import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateEvent,
  deleteEvent,
  markEventComplete,
  convertToWorkOrder,
} from "../api/maintenanceEvents";
import {
  runPlanNow,
  pausePlan,
  resumePlan,
  deletePlan,
  updatePlan,
} from "../api/maintenancePlans";
import { UpdateEventData, UpdatePlanData } from "../types/maintenanceDashboard.types";

/**
 * Hook for maintenance event mutations
 */
export const useMaintenanceMutations = () => {
  const queryClient = useQueryClient();

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "event"] });
      toast.success("Event updated successfully");
    },
    onError: () => {
      toast.error("Failed to update event");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
      toast.success("Event deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete event");
    },
  });

  const markEventDoneMutation = useMutation({
    mutationFn: (id: string) => markEventComplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "event"] });
      toast.success("Event marked as completed");
    },
    onError: () => {
      toast.error("Failed to mark event as completed");
    },
  });

  const convertToWorkOrderMutation = useMutation({
    mutationFn: (id: string) => convertToWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success("Work order created successfully");
    },
    onError: () => {
      toast.error("Failed to create work order");
    },
  });

  const runPlanNowMutation = useMutation({
    mutationFn: (planId: string) => runPlanNow(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "scheduled"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans"] });
      toast.success("Plan executed successfully");
    },
    onError: () => {
      toast.error("Failed to execute plan");
    },
  });

  const pausePlanMutation = useMutation({
    mutationFn: (planId: string) => pausePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans"] });
      toast.success("Plan paused");
    },
    onError: () => {
      toast.error("Failed to pause plan");
    },
  });

  const resumePlanMutation = useMutation({
    mutationFn: (planId: string) => resumePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans"] });
      toast.success("Plan resumed");
    },
    onError: () => {
      toast.error("Failed to resume plan");
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans"] });
      toast.success("Plan deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete plan");
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanData }) =>
      updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans"] });
      toast.success("Plan updated successfully");
    },
    onError: () => {
      toast.error("Failed to update plan");
    },
  });

  return {
    updateEvent: updateEventMutation,
    deleteEvent: deleteEventMutation,
    markEventDone: markEventDoneMutation,
    convertToWorkOrder: convertToWorkOrderMutation,
    runPlanNow: runPlanNowMutation,
    pausePlan: pausePlanMutation,
    resumePlan: resumePlanMutation,
    deletePlan: deletePlanMutation,
    updatePlan: updatePlanMutation,
  };
};
