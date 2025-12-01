import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPart, CreatePartRequest } from "../api/createPart";
import { updatePart, UpdatePartRequest } from "../api/updatePart";
import { deletePart } from "../api/deletePart";
import { toast } from "sonner";

export function useCreatePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartRequest) => createPart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part created", {
        description: "New part has been added to your inventory.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to create part", {
        description: error?.response?.data?.error || "An error occurred while creating the part.",
      });
    },
  });
}

export function useUpdatePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartRequest }) =>
      updatePart(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part updated", {
        description: "Part information has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update part", {
        description: error?.response?.data?.error || "An error occurred while updating the part.",
      });
    },
  });
}

export function useDeletePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part deleted", {
        description: "Part has been removed from your inventory.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete part", {
        description: error?.response?.data?.error || "An error occurred while deleting the part.",
      });
    },
  });
}
