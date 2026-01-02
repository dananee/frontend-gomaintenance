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
    mutationFn: ({ id }: { id: string; vehicleId?: string }) => pausePlan(id),
    onMutate: async ({ id }: { id: string; vehicleId?: string }) => {
      // Cancel all relevant queries using prefix matching
      await queryClient.cancelQueries({ queryKey: ["maintenance", "plans"] });
      await queryClient.cancelQueries({ queryKey: ["vehicles"] });
      await queryClient.cancelQueries({ queryKey: ["vehicle-maintenance-plans"] });

      // Snapshot previous values
      const previousPlans = queryClient.getQueriesData({ queryKey: ["maintenance", "plans"] });
      const previousVehicles = queryClient.getQueriesData({ queryKey: ["vehicles"] });
      const previousVehiclePlans = queryClient.getQueriesData({ queryKey: ["vehicle-maintenance-plans"] });

      // Helper to update plan status
      const updatePlanStatus = (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((plan: any) =>
            plan.id === id
              ? { ...plan, status: "paused", is_active: false }
              : plan
          );
        }
        return old;
      };

      // Update ALL queries matching the prefixes - this handles specific vehicle IDs automatically
      queryClient.setQueriesData({ queryKey: ["maintenance", "plans"] }, updatePlanStatus);
      queryClient.setQueriesData({ queryKey: ["vehicle-maintenance-plans"] }, updatePlanStatus);
      
      // Update nested vehicle plans
      queryClient.setQueriesData({ queryKey: ["vehicles"] }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((vehicle: any) => {
            if (vehicle.maintenance_plans) {
              return {
                ...vehicle,
                maintenance_plans: vehicle.maintenance_plans.map((plan: any) =>
                  plan.id === id
                    ? { ...plan, status: "paused", is_active: false }
                    : plan
                ),
              };
            }
            return vehicle;
          });
        }
        return old;
      });

      return { previousPlans, previousVehicles, previousVehiclePlans };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousPlans) {
        context.previousPlans.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousVehicles) {
        context.previousVehicles.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousVehiclePlans) {
        context.previousVehiclePlans.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to pause plan");
    },
    onSuccess: () => {
      toast.success("Plan paused");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-maintenance-plans"] });
    },
  });

  const resumePlanMutation = useMutation({
    mutationFn: ({ id }: { id: string; vehicleId?: string }) => resumePlan(id),
    onMutate: async ({ id }: { id: string; vehicleId?: string }) => {
      // Cancel all relevant queries using prefix matching
      await queryClient.cancelQueries({ queryKey: ["maintenance", "plans"] });
      await queryClient.cancelQueries({ queryKey: ["vehicles"] });
      await queryClient.cancelQueries({ queryKey: ["vehicle-maintenance-plans"] });

      // Snapshot previous values
      const previousPlans = queryClient.getQueriesData({ queryKey: ["maintenance", "plans"] });
      const previousVehicles = queryClient.getQueriesData({ queryKey: ["vehicles"] });
      const previousVehiclePlans = queryClient.getQueriesData({ queryKey: ["vehicle-maintenance-plans"] });

      // Helper to update plan status
      const updatePlanStatus = (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((plan: any) =>
            plan.id === id
              ? { ...plan, status: "active", is_active: true }
              : plan
          );
        }
        return old;
      };

      // Update ALL queries matching the prefixes
      queryClient.setQueriesData({ queryKey: ["maintenance", "plans"] }, updatePlanStatus);
      queryClient.setQueriesData({ queryKey: ["vehicle-maintenance-plans"] }, updatePlanStatus);

      // Update nested vehicle plans
      queryClient.setQueriesData({ queryKey: ["vehicles"] }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((vehicle: any) => {
            if (vehicle.maintenance_plans) {
              return {
                ...vehicle,
                maintenance_plans: vehicle.maintenance_plans.map((plan: any) =>
                  plan.id === id
                    ? { ...plan, status: "active", is_active: true }
                    : plan
                ),
              };
            }
            return vehicle;
          });
        }
        return old;
      });

      return { previousPlans, previousVehicles, previousVehiclePlans };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousPlans) {
        context.previousPlans.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousVehicles) {
        context.previousVehicles.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousVehiclePlans) {
        context.previousVehiclePlans.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to resume plan");
    },
    onSuccess: () => {
      toast.success("Plan resumed");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "plans"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-maintenance-plans"] });
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
