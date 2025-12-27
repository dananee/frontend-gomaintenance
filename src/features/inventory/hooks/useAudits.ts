import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAudits, getAudit, createAudit, updateAuditLines, validateAudit } from "../api/inventoryAudits";
import { toast } from "sonner";

export const useAudits = () => {
  return useQuery({
    queryKey: ["inventory-audits"],
    queryFn: getAudits,
  });
};

export const useAudit = (id: string) => {
  return useQuery({
    queryKey: ["inventory-audits", id],
    queryFn: () => getAudit(id),
    enabled: !!id,
  });
};

export const useCreateAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-audits"] });
      toast.success("Audit session created");
    },
  });
};

export const useUpdateAuditLines = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lines: any[]) => updateAuditLines(id, lines),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-audits", id] });
      toast.success("Audit lines updated");
    },
  });
};

export const useValidateAudit = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => validateAudit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-audits", id] });
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.success("Audit validated and stock adjusted");
    },
    onError: (err: any) => {
        toast.error("Failed to validate audit", {
            description: err?.response?.data?.error || "An error occurred"
        });
    }
  });
};
