import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSuppliers, GetSuppliersParams, createSupplier, CreateSupplierRequest, updateSupplier, UpdateSupplierRequest, deleteSupplier } from "../api/suppliers";
import { toast } from "sonner";

export function useSuppliers(params: GetSuppliersParams = {}) {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierRequest) => createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier created", {
        description: "New supplier has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to create supplier", {
        description: error?.response?.data?.error || "An error occurred while creating the supplier.",
      });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierRequest }) =>
      updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier updated", {
        description: "Supplier information has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update supplier", {
        description: error?.response?.data?.error || "An error occurred while updating the supplier.",
      });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted", {
        description: "Supplier has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete supplier", {
        description: error?.response?.data?.error || "An error occurred while deleting the supplier.",
      });
    },
  });
}
